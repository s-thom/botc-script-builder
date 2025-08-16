<script lang="ts">
  import {
    LightbulbEmpty,
    MapVertical,
    PersonAdd,
    Settings,
    type SvgComponent,
  } from "svelte-codicons";
  import { globalState, type GlobalState } from "../../lib/state.svelte";

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
    "select-characters": { title: "Roles", icon: PersonAdd },
  };

  function setScreenHandler(screen: ScreenName) {
    return () => {
      globalState.ui.screen = screen;
    };
  }

  const { pages }: Props = $props();
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
            <span><IconComponent /></span>
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
