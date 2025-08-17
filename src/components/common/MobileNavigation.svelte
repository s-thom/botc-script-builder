<script lang="ts">
  import {
    Lightbulb,
    LightbulbAutofix,
    LightbulbEmpty,
    MapVertical,
    PersonAdd,
    Settings,
    type SvgComponent,
  } from "svelte-codicons";
  import type { GlobalState } from "../../lib/state/types";
  import { checksState, globalState } from "../../lib/state.svelte";

  type ScreenName = GlobalState["ui"]["screen"];

  interface PageInfo {
    title: string;
    icon: typeof SvgComponent;
  }

  interface Props {
    pages: ScreenName[];
  }

  const PAGE_DATA: Record<ScreenName, PageInfo> = {
    script: { title: "Script", icon: MapVertical },
    options: { title: "Options", icon: Settings },
    checks: { title: "Checks", icon: LightbulbEmpty },
    "checks:about": { title: "About checks", icon: LightbulbEmpty },
    "select-characters": { title: "Roles", icon: PersonAdd },
  };

  function setScreenHandler(screen: ScreenName) {
    return () => {
      globalState.ui.screen = screen;
      globalState.ui.prevScreen = undefined;
    };
  }

  const { pages }: Props = $props();

  const checksData = $derived.by(() => {
    const allResults = [
      ...checksState.errors,
      ...checksState.warnings,
      ...checksState.infos,
    ].filter((result) => !globalState.ui.ignoredChecks.includes(result.id));
    const hasResults = allResults.length > 0;

    for (const result of allResults) {
      if (result.actions && result.actions.length > 0) {
        return { hasResults, hasFixes: true };
      }
    }

    return { hasResults, hasFixes: false };
  });
</script>

<nav>
  <ul class="nav-list">
    {#each pages as page}
      {#if page !== "checks" || globalState.ui.useChecks}
        {@const IconComponent = PAGE_DATA[page].icon}
        <li class="nav-item">
          <button
            type="button"
            class={[
              "nav-button",
              globalState.ui.screen.startsWith(page) && "current",
            ]}
            onclick={setScreenHandler(page)}
          >
            <span
              >{#if page === "checks"}
                {#if checksData.hasFixes}
                  <LightbulbAutofix />
                {:else if checksData.hasResults}
                  <Lightbulb />
                {:else}
                  <IconComponent />
                {/if}
              {:else}
                <IconComponent />
              {/if}</span
            >
            <span>{PAGE_DATA[page].title}</span>
          </button>
        </li>
      {/if}
    {/each}
  </ul>
</nav>

<style>
  .nav-list {
    display: flex;
    list-style: none;
    padding: 0.2rem;

    justify-content: space-around;
    justify-content: space-evenly;
    gap: 0.2em;

    border-block-start: 2px solid var(--color-control-border-hover);
  }

  .nav-item {
    flex-grow: 1;
    display: block;
  }

  .nav-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0.2rem;

    border-radius: var(--border-radius);
    border: 2px solid var(--color-control-border-active);
    background-color: var(--color-control-background-active);

    &.current {
      background-color: var(--color-control-background);
      border: 2px solid var(--color-control-border-active);
    }
  }
</style>
