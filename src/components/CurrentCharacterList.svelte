<script lang="ts">
  import type { CharacterTeam } from "../generated/script-schema";
  import { globalState } from "../lib/state.svelte";
  import TeamCharacterList from "./list/TeamCharacterList.svelte";

  const teamNames: Record<CharacterTeam, string> = {
    townsfolk: "Townsfolk",
    outsider: "Outsiders",
    minion: "Minions",
    demon: "Demons",
    traveller: "Travellers",
    fabled: "Fabled",
  };
</script>

{#each Object.entries(teamNames) as [team, teamName]}
  {#if globalState.characters[team as CharacterTeam].length > 0}
    <h2>{teamName}</h2>
    <TeamCharacterList
      {team}
      characters={globalState.characters[team as CharacterTeam]}
    />
  {/if}
{/each}

<style>
</style>
