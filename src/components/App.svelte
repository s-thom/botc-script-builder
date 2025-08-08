<script lang="ts">
  import tb from "../generated/edition-scripts/tb.json";
  import { setScript } from "../lib/state.svelte";
  import CurrentCharacterList from "./CurrentCharacterList.svelte";
</script>

<main class="container">
  <div class="column character-list">
    <button
      type="button"
      onclick={() => {
        setScript(tb);
      }}>set script to tb</button
    >
    <div></div>
    <CurrentCharacterList />
  </div>
  <div class="column">dsfjklasdfjklsdfkl</div>
  <div class="column">errterwerwerwe</div>
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
  }

  .character-list {
    width: 300px;
  }
</style>
