<script lang="ts">
  import tb from "../generated/edition-scripts/tb.json";
  import { setScript } from "../lib/state.svelte";
  import CurrentCharacterList from "./CurrentCharacterList.svelte";
</script>

<main>
  <div>
    <button
      type="button"
      onclick={() => {
        setScript(tb);
      }}>set script to tb</button
    >
  </div>
  <div>
    <div></div>
    <CurrentCharacterList />
  </div>
</main>

<style>
</style>
