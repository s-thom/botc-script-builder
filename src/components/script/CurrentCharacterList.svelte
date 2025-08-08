<script lang="ts">
  import type { CharacterTeam } from "../../generated/script-schema";
  import { globalState } from "../../lib/state.svelte";
  import TeamCharacterList from "./TeamCharacterList.svelte";

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
    <div class="team-list">
      <h2>{teamName}</h2>
      <TeamCharacterList
        {team}
        characters={globalState.characters[team as CharacterTeam]}
      />
    </div>
  {/if}
{/each}

<style>
  .team-list {
    margin-block: 1rem;
  }
</style>
