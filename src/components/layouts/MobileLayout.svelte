<svelte:options runes />

<script lang="ts">
  import { globalState } from "../../lib/state.svelte";
  import CharacterSelectForm from "../character-selection/CharacterSelectForm.svelte";
  import AboutChecks from "../checks/AboutChecks.svelte";
  import ChecksList from "../checks/ChecksList.svelte";
  import MobileNavigation from "../common/MobileNavigation.svelte";
  import PromptDisplay from "../common/PromptDisplay.svelte";
  import TopSticky from "../common/TopSticky.svelte";
  import ImportExportForm from "../options/ImportExportForm.svelte";
  import ScriptOptions from "../options/ScriptOptions.svelte";
  import BasicMetadataForm from "../script/BasicMetadataForm.svelte";
  import CurrentCharacterList from "../script/CurrentCharacterList.svelte";
</script>

<main class="container">
  <div class="scroll-container content">
    <div class="panel panel-padding">
      {#if globalState.ui.screen === "script"}
        <TopSticky>
          <BasicMetadataForm />
          <ImportExportForm />
          <PromptDisplay />
        </TopSticky>
        <CurrentCharacterList />
      {:else if globalState.ui.screen === "select-characters"}
        <CharacterSelectForm />
      {:else if globalState.ui.screen === "options"}
        <ScriptOptions />
      {:else if globalState.ui.screen === "checks"}
        <ChecksList />
      {:else if globalState.ui.screen === "checks:about"}
        <AboutChecks />
      {/if}
    </div>
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
