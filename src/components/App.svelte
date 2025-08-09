<script lang="ts">
  import ImportExportForm from "./options/ImportExportForm.svelte";
  import BasicMetadataForm from "./script/BasicMetadataForm.svelte";
  import CurrentCharacterList from "./script/CurrentCharacterList.svelte";
</script>

<main class="container">
  <div class="panel script-panel">
    <BasicMetadataForm />
    <CurrentCharacterList />
  </div>
  <div class="panel main-panel"></div>
  <div class="panel options-panel">
    <ImportExportForm />
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
    max-height: 100%;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .script-panel,
  .options-panel {
    width: 350px;
  }

  .script-panel {
    border-inline-end: 2px solid var(--color-control-border-hover);
  }

  .options-panel {
    border-inline-start: 2px solid var(--color-control-border-hover);
  }

  .main-panel {
    flex-grow: 1;
  }
</style>
