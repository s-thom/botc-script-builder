<script lang="ts">
  import type { CharacterTeam } from "../../generated/script-schema";
  import {
    CHARACTERS_BY_ID,
    getEnforcedFabled,
    TEAM_NAMES,
  } from "../../lib/characters";
  import { globalState } from "../../lib/state.svelte";
  import TeamCharacterList from "./TeamCharacterList.svelte";

  const forcedFabled = $derived.by(() => {
    const map = getEnforcedFabled(globalState);
    return Array.from(map.entries()).map(([id, reasons]) => ({
      character: CHARACTERS_BY_ID.get(id)!,
      reasons: Array.from(reasons).sort(),
    }));
  });
</script>

{#each Object.entries(TEAM_NAMES) as [team, teamName]}
  {#if globalState.characters[team as CharacterTeam].length > 0 || (team === "fabled" && forcedFabled.length > 0)}
    <div class="team-list">
      <h2>{teamName}</h2>
      <TeamCharacterList
        team={team as CharacterTeam}
        characters={globalState.characters[team as CharacterTeam]}
        forced={team === "fabled" ? forcedFabled : undefined}
      />
    </div>
  {/if}
{/each}

<style>
  .team-list {
    margin-block: 1rem;
  }
</style>
