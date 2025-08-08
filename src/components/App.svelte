<script lang="ts">
  import tb from "../generated/edition-scripts/tb.json";
  import { setScript } from "../lib/state.svelte";
  import BasicMetadataForm from "./script/BasicMetadataForm.svelte";
  import CurrentCharacterList from "./script/CurrentCharacterList.svelte";
</script>

<main class="container">
  <div class="column character-list">
    <BasicMetadataForm />
    <button
      type="button"
      onclick={() => {
        setScript(tb);
      }}>set script to tb</button
    >
    <CurrentCharacterList />
  </div>
  <div class="column"></div>
  <div class="column"></div>
</main>

<style>
  .container {
    height: 100vh;
    max-height: 100vh;
    display: flex;
  }

  .column {
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .character-list {
    width: 300px;
  }
</style>
