<script lang="ts">
  import type {
    CharacterTeam,
    ScriptCharacter,
  } from "../../generated/script-schema";
  import {
    CHARACTERS_BY_TEAM,
    getEnforcedFabled,
    TEAM_NAMES,
  } from "../../lib/characters";
  import { globalState } from "../../lib/state.svelte";
  import CharacterSelectList from "./CharacterSelectList.svelte";

  const filteredCharactersByTeam = $derived.by<
    Record<CharacterTeam, ScriptCharacter[]>
  >(() => CHARACTERS_BY_TEAM);

  const selectedSet = $derived.by<Set<string>>(() => {
    const inScript = Object.values(globalState.characters).flatMap(
      (characters) => characters.map((character) => character.id)
    );
    const forcedFabled = getEnforcedFabled(globalState);

    const set = new Set(inScript);
    for (const [forcedId] of forcedFabled) {
      set.add(forcedId);
    }

    return set;
  });
</script>

<h2>Select characters</h2>

{#each Object.entries(TEAM_NAMES) as [team, teamName]}
  <div class="team-list">
    <h3>{teamName}</h3>
    <CharacterSelectList
      team={team as CharacterTeam}
      characters={filteredCharactersByTeam[team as CharacterTeam]}
      {selectedSet}
    />
  </div>
{/each}

<style>
  .team-list {
    margin-block: 1rem;
  }
</style>
