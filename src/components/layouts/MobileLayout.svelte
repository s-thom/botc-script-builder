<svelte:options runes />

<script lang="ts">
  import { globalState } from "../../lib/state.svelte";
  import CharacterSelectForm from "../character-selection/CharacterSelectForm.svelte";
  import ChecksList from "../checks/ChecksList.svelte";
  import MobileNavigation from "../common/MobileNavigation.svelte";
  import ImportExportForm from "../options/ImportExportForm.svelte";
  import ScriptOptions from "../options/ScriptOptions.svelte";
  import BasicMetadataForm from "../script/BasicMetadataForm.svelte";
  import CurrentCharacterList from "../script/CurrentCharacterList.svelte";
</script>

<main class="container">
  <div class="scroll-container content">
    {#if globalState.ui.screen === "script"}
      <div class="panel panel-padding">
        <BasicMetadataForm />
        <CurrentCharacterList />
      </div>
    {:else if globalState.ui.screen === "select-characters"}
      <div class="panel panel-padding">
        <CharacterSelectForm />
      </div>
    {:else if globalState.ui.screen === "options"}
      <div class="panel panel-padding">
        <ImportExportForm />
        <ScriptOptions />
      </div>
    {:else if globalState.ui.screen === "checks"}
      <div class="panel panel-padding">
        <ChecksList />
      </div>
    {/if}
  </div>

  <MobileNavigation
    pages={["script", "select-characters", "checks", "options"]}
  />
</main>

<style>
  .container {
    height: 100vh;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .content {
    flex-grow: 1;
  }

  .scroll-container {
    overflow-y: auto;
  }

  .panel-padding {
    padding: 0.5rem;
  }
</style>
