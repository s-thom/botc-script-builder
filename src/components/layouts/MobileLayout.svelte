<svelte:options runes />

<script lang="ts">
  import { globalState } from "../../lib/state.svelte";
  import CharacterSelectForm from "../character-selection/CharacterSelectForm.svelte";
  import ChecksDrawer from "../checks/ChecksDrawer.svelte";
  import ImportExportForm from "../options/ImportExportForm.svelte";
  import ScriptOptions from "../options/ScriptOptions.svelte";
  import BasicMetadataForm from "../script/BasicMetadataForm.svelte";
  import CurrentCharacterList from "../script/CurrentCharacterList.svelte";
</script>

<main class="container">
  <div class="panel panel-padding scroll-container script-panel">
    <BasicMetadataForm />
    <CurrentCharacterList />
  </div>
  <div class="panel main-panel">
    <div class="panel-padding scroll-container">
      <CharacterSelectForm />
    </div>
    {#if globalState.ui.useChecks}
      <ChecksDrawer />
    {/if}
  </div>
  <div class="panel panel-padding scroll-container options-panel">
    <ImportExportForm />
    <ScriptOptions />
  </div>
</main>

<style>
  .container {
    height: 100vh;
    max-height: 100vh;
    display: flex;
  }

  .panel {
    height: 100%;
    max-height: 100vh;
  }

  .scroll-container {
    overflow-y: auto;
  }

  .panel-padding {
    padding: 0.5rem;
  }

  .script-panel,
  .options-panel {
    width: 350px;
    flex-shrink: 0;
  }

  .script-panel {
    border-inline-end: 2px solid var(--color-control-border-hover);
  }

  .options-panel {
    border-inline-start: 2px solid var(--color-control-border-hover);
  }

  .main-panel {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
</style>
