<script lang="ts">
  import tb from "../generated/edition-scripts/tb.json";
  import { globalState, setScript } from "../lib/state.svelte";
  import CharacterIcon from "./common/CharacterIcon.svelte";
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
    <ul>
      {#each globalState.characters as character}
        <li>
          <CharacterIcon {character} />
          <h3>{character.name}</h3>
        </li>
      {/each}
    </ul>
  </div>
</main>

<style>
</style>
