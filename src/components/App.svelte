<script lang="ts">
  import tb from "../generated/edition-scripts/tb.json";
  import { getFullScriptCharacter, isScriptMetadata } from "../lib/characters";
  import { scriptState } from "../lib/state.svelte";
  import CharacterIcon from "./common/CharacterIcon.svelte";

  const meta = $derived(
    scriptState.script.find((item) => isScriptMetadata(item))
  );
  const characters = $derived(
    scriptState.script
      .filter((item) => !isScriptMetadata(item))
      .map((item) => getFullScriptCharacter(item))
  );
</script>

<main>
  <div>
    <button
      type="button"
      onclick={() => {
        scriptState.script = tb;
      }}>set script to tb</button
    >
  </div>
  <div>
    <div></div>
    <ul>
      {#each characters as character}
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
