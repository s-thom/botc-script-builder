<script lang="ts">
  import type { CharacterTeam } from "../../generated/script-schema";
  import {
    CHARACTERS_BY_ID,
    getEnforcedFabled,
    TEAM_NAMES,
  } from "../../lib/characters";
  import { globalState } from "../../lib/state.svelte";
  import CharacterIcon from "../common/CharacterIcon.svelte";
  import TeamCharacterList from "./TeamCharacterList.svelte";

  const forcedFabled = $derived.by(() => {
    const map = getEnforcedFabled(globalState);

    // Remove fabled that are already in the script
    for (const fabled of globalState.characters.fabled) {
      map.delete(fabled.id);
    }

    return Array.from(map.entries()).map(([id, reasons]) => ({
      character: CHARACTERS_BY_ID.get(id)!,
      reasons: Array.from(reasons).sort(),
    }));
  });

  const teams = Object.entries(TEAM_NAMES)
    .map(([team, teamName]) => ({
      team: team as CharacterTeam,
      teamName,
      characters: globalState.characters[team as CharacterTeam],
      pinned: team === "fabled" ? forcedFabled : undefined,
    }))
    .filter(
      ({ characters, pinned }) => characters.length + (pinned?.length ?? 0) > 0
    );
</script>

{#each teams as { team, teamName, characters, pinned } (team)}
  <div class="team-list">
    <h2>{teamName}</h2>
    <TeamCharacterList
      team={team as CharacterTeam}
      {characters}
      forced={pinned}
    />
  </div>
{:else}
  <div class="info-area">
    <CharacterIcon
      character={{
        id: "magician",
        name: "",
        team: "townsfolk",
        ability: "",
      }}
      class="info-area-icon slow-spin"
    />
    <p>No characters!</p>
    <p>Select some characters to get started.</p>
    <button
      type="button"
      class="button mobile-only tablet-only"
      onclick={() => (globalState.ui.screen = "select-characters")}
      >Select characters</button
    >
  </div>
{/each}

<style>
  .team-list {
    margin-block: 1rem;
  }

  .info-area {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;

    :global(.info-area-icon) {
      width: 128px;
    }
  }
</style>
