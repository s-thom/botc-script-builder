<script lang="ts">
  import {
    CircleCheckBigIcon,
    CircleXIcon,
    InfoIcon,
    OctagonXIcon,
    TriangleAlertIcon,
  } from "@lucide/svelte";

  interface Props {
    loading: boolean;
    errors: number;
    warnings: number;
    info: number;
    onTabClick?: () => void;
  }

  const { loading, errors, warnings, info, onTabClick }: Props = $props();
  const total = errors + warnings + info;
</script>

<div class="bar">
  <button type="button" class="tab" onclick={onTabClick}>
    <span class="visually-hidden">Toggle checks drawer</span>
    {#if total > 0}
      <OctagonXIcon class="tab-icon" aria-label="Errors" />
      &nbsp;{errors}
      <TriangleAlertIcon class="tab-icon" aria-label="Warnings" />
      &nbsp;{warnings}
      <InfoIcon class="tab-icon" aria-label="Info" />
      &nbsp;{info}
    {:else}
      <CircleCheckBigIcon class="tab-icon" aria-label="Success" /><span>
        &nbsp;All passed</span
      >
    {/if}
  </button>
</div>

<style>
  .bar {
    width: 100%;
    height: 2px;
    position: relative;
    background-color: var(--color-control-border-hover);
  }

  .tab {
    position: absolute;
    inset-inline-end: 0;
    inset-block-end: 0;
    background-color: var(--color-control-background-active);
    border: none;
    border-block-start: 2px solid var(--color-control-border-hover);
    border-inline-start: 2px solid var(--color-control-border-hover);

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
