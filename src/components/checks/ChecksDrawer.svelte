<script lang="ts">
  import {
    CircleCheckBigIcon,
    InfoIcon,
    OctagonXIcon,
    TriangleAlertIcon,
  } from "@lucide/svelte";
  import { getAbortSignal } from "svelte";
  import { slide } from "svelte/transition";
  import { runAllChecks } from "../../lib/checks";
  import type { CheckResult } from "../../lib/checks/types";
  import { globalState } from "../../lib/state.svelte";
  import { groupBy } from "../../lib/util/arrays";
  import { delay } from "../../lib/util/async";
  import ChecksList from "./ChecksList.svelte";

  const PANEL_MINIMUM_SIZE = 50;
  const PANEL_MINIMUM_SIZE_GRACE = 10;
  const PANEL_MAXIMUM_SIZE = 800;

  let isLoading = $state(false);
  let checkResults = $state<CheckResult[]>([]);

  function onTabClick() {
    globalState.ui.isChecksDrawerOpen = !globalState.ui.isChecksDrawerOpen;
  }

  function keyPressHandler(event: KeyboardEvent) {
    const element = event.currentTarget as HTMLElement;

    let moveAmount = 10;
    if (event.metaKey) {
      moveAmount = 1;
    } else if (event.shiftKey) {
      moveAmount = 50;
    }

    switch (event.key) {
      case "ArrowDown":
        globalState.ui.panelSizes.checks = Math.max(
          Math.min(
            globalState.ui.panelSizes.checks - moveAmount,
            PANEL_MAXIMUM_SIZE
          ),
          PANEL_MINIMUM_SIZE
        );
        break;
      case "ArrowUp":
        globalState.ui.panelSizes.checks = Math.max(
          Math.min(
            globalState.ui.panelSizes.checks + moveAmount,
            PANEL_MAXIMUM_SIZE
          ),
          PANEL_MINIMUM_SIZE
        );
        break;
      case "Home":
        globalState.ui.panelSizes.checks = PANEL_MINIMUM_SIZE;
        break;
      case "End":
        globalState.ui.panelSizes.checks = PANEL_MAXIMUM_SIZE;
        break;
    }
  }

  function mouseDownHandler(event: PointerEvent) {
    const element = event.currentTarget as HTMLElement;

    const initialY = event.clientY;
    let initialHeight = globalState.ui.panelSizes.checks;
    if (!globalState.ui.isChecksDrawerOpen) {
      initialHeight -= PANEL_MINIMUM_SIZE;
    }

    const doc = document.documentElement;

    function moveHandler(event2: PointerEvent) {
      const newY = event2.clientY;

      const difference = (newY - initialY) * -1;

      const rawHeight = initialHeight + difference;

      // Open/close if too low
      globalState.ui.isChecksDrawerOpen =
        rawHeight > PANEL_MINIMUM_SIZE - PANEL_MINIMUM_SIZE_GRACE;

      const newHeight = Math.max(
        Math.min(rawHeight, PANEL_MAXIMUM_SIZE),
        PANEL_MINIMUM_SIZE
      );

      globalState.ui.panelSizes.checks = newHeight;
    }
    doc.addEventListener("pointermove", moveHandler);

    function removeHandlers() {
      doc.removeEventListener("pointermove", moveHandler);
      doc.removeEventListener("pointerup", removeHandlers);
      doc.removeEventListener("pointerleave", removeHandlers);
    }
    doc.addEventListener("pointerup", removeHandlers, { once: true });
    doc.addEventListener("pointerleave", removeHandlers, { once: true });
  }

  $effect(() => {
    const signal = getAbortSignal();
    const state = $state.snapshot(globalState);
    isLoading = true;

    delay(300, signal)
      .then(() => runAllChecks(state, signal))
      .then((results) => {
        checkResults = results;
        isLoading = false;
      })
      .catch((err: unknown) => {
        if (
          typeof err === "object" &&
          err != null &&
          "type" in err &&
          err.type === "abort"
        ) {
          return;
        }
        console.error("Error while running checks", err);
      });
  });

  const {
    error = [],
    warning = [],
    info = [],
  } = $derived.by(() => groupBy(checkResults, (result) => result.level));

  const [numErrors, numWarnings, numInfo] = $derived.by(() => [
    error.length,
    warning.length,
    info.length,
  ]);
  const total = $derived(numErrors + numWarnings + numInfo);
</script>

<div
  class={[
    "resize-panel checks-panel-container",
    globalState.ui.isChecksDrawerOpen && "open",
  ]}
>
  <!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role -->
  <button
    class="panel-resize-handle"
    role="separator"
    aria-valuenow={globalState.ui.panelSizes.checks}
    aria-valuemin={PANEL_MINIMUM_SIZE}
    aria-valuemax={PANEL_MAXIMUM_SIZE}
    onkeydown={keyPressHandler}
    onpointerdown={mouseDownHandler}
    ><span class="visually-hidden">Change checks panel size</span></button
  >
  <button type="button" class="tab" onclick={onTabClick}>
    <span class="visually-hidden">Toggle checks drawer</span>
    {#if total > 0}
      <OctagonXIcon class="tab-icon" aria-label="Errors" />
      &nbsp;{numErrors}
      <TriangleAlertIcon class="tab-icon" aria-label="Warnings" />
      &nbsp;{numWarnings}
      <InfoIcon class="tab-icon" aria-label="Info" />
      &nbsp;{numInfo}
    {:else}
      <CircleCheckBigIcon class="tab-icon" aria-label="Success" /><span>
        &nbsp;All passed</span
      >
    {/if}
  </button>
  {#if globalState.ui.isChecksDrawerOpen}
    <div
      class="resize-panel-content scroll-container"
      transition:slide={{ axis: "y", duration: 100 }}
    >
      <ChecksList errors={error} warnings={warning} {info} />
    </div>
  {/if}
</div>

<style>
  .scroll-container {
    overflow-y: auto;
  }

  .resize-panel {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    position: relative;

    .resize-panel-content {
      flex-grow: 1;
    }
  }

  .panel-resize-handle {
    width: 100%;
    height: var(--panel-resize-handle-size);
    background-color: var(--color-control-border-hover);
    border: none;
    top: 0;
    padding: 0;
    cursor: ns-resize;
    transition: transform 150ms ease-in-out;
    z-index: 1;

    inset-block-start: calc(-1 * var(--panel-resize-handle-size));

    &:hover {
      transform: scaleY(2);
      background-color: var(--color-control-border-active);
    }
  }

  .checks-panel-container {
    height: var(--panel-resize-handle-size);

    &.open {
      height: clamp(50px, var(--panel-checks-height), 800px);
    }
  }

  .tab {
    position: absolute;
    inset-inline-end: 0;
    inset-block-start: 0;
    transform: translateY(-100%);
    background-color: var(--color-control-background-active);
    border: none;
    border-block-start: var(--panel-resize-handle-size) solid
      var(--color-control-border-hover);
    border-inline-start: var(--panel-resize-handle-size) solid
      var(--color-control-border-hover);

    display: flex;
    align-items: center;

    &:hover:not(:active) {
      background-color: var(--color-control-background);
      border-color: var(--color-control-border-active);
    }

    :global(.tab-icon) {
      width: 0.8rem;
    }
  }
</style>
