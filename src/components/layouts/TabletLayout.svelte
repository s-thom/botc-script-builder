<svelte:options runes />

<script lang="ts">
  import { globalState } from "../../lib/state.svelte";
  import CharacterSelectForm from "../character-selection/CharacterSelectForm.svelte";
  import ChecksDrawer from "../checks/ChecksDrawer.svelte";
  import MobileNavigation from "../common/MobileNavigation.svelte";
  import ImportExportForm from "../options/ImportExportForm.svelte";
  import ScriptOptions from "../options/ScriptOptions.svelte";
  import BasicMetadataForm from "../script/BasicMetadataForm.svelte";
  import CurrentCharacterList from "../script/CurrentCharacterList.svelte";
</script>

<main class="container">
  <div class="panel detail-panel">
    <div class="panel-padding scroll-container detail-panel-content">
      {#if globalState.ui.screen === "options"}
        <ImportExportForm />
        <ScriptOptions />
      {:else if globalState.ui.screen === "checks"}
        <ChecksDrawer />
      {:else}
        <BasicMetadataForm />
        <CurrentCharacterList />
      {/if}
    </div>
    <MobileNavigation pages={["script", "checks", "options"]} />
  </div>
  <div class="panel panel-padding scroll-container">
    <CharacterSelectForm />
  </div>
</main>

<style>
  .container {
    height: 100vh;
    max-height: 100vh;
    display: flex;
  }

  .panel {
    flex-basis: 50%;

    &:not(:first-child) {
      border-inline-start: 1px solid var(--color-control-border-hover);
    }

    &:not(:last-child) {
      border-inline-end: 1px solid var(--color-control-border-hover);
    }
  }

  .scroll-container {
    overflow-y: auto;
  }

  .panel-padding {
    padding: 0.5rem;
  }

  .detail-panel {
    display: flex;
    flex-direction: column;

    .detail-panel-content {
      flex-grow: 1;
    }
  }
</style>
