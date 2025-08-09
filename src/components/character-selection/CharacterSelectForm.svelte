<script lang="ts">
  import type {
    ASpecialAppIntegrationFeature,
    CharacterTeam,
    ScriptCharacter,
  } from "../../generated/script-schema";
  import {
    CHARACTERS_BY_TEAM,
    getEnforcedFabled,
    TEAM_NAMES,
  } from "../../lib/characters";
  import { CHARACTER_METADATA } from "../../lib/metadata/characters";
  import { EDITION_ICONS, EDITION_NAMES } from "../../lib/metadata/editions";
  import type { CharacterEdition } from "../../lib/metadata/types";
  import { globalState } from "../../lib/state.svelte";
  import { filterInPlace } from "../../lib/util/arrays";
  import CharacterSelectList from "./CharacterSelectList.svelte";

  const TEAM_CHARACTERS: ScriptCharacter[] = Object.entries(TEAM_NAMES).map(
    ([team, name]) => ({
      id: team,
      name,
      team: team as never,
      ability: "",
    })
  );

  const EDITION_CHARACTERS: ScriptCharacter[] = Object.entries(
    EDITION_NAMES
  ).map(([edition, name]) => ({
    id: edition,
    name,
    team: edition as never,
    ability: "",
    special: [
      {
        type: "botc-script-builder",
        name: "replace-icon",
        value: EDITION_ICONS[edition as CharacterEdition],
      } as never,
    ],
  }));

  let search = $state("");
  let teamFilter = $state(new Set<string>());
  let editionFilter = $state(new Set<string>());

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

  function onCharacterSelect(character: ScriptCharacter) {
    if (selectedSet.has(character.id)) {
      for (const characters of Object.values(globalState.characters)) {
        filterInPlace(characters, (c) => c.id !== character.id);
      }
    } else {
      globalState.characters[character.team].push(character);
    }
  }

  function onTeamSelect(character: ScriptCharacter) {
    const newSet = new Set(teamFilter);
    if (newSet.has(character.id)) {
      newSet.delete(character.id);
    } else {
      newSet.add(character.id);
    }
    teamFilter = newSet;
  }

  function onEditionSelect(character: ScriptCharacter) {
    const newSet = new Set(editionFilter);
    if (newSet.has(character.id)) {
      newSet.delete(character.id);
    } else {
      newSet.add(character.id);
    }
    editionFilter = newSet;
  }

  const filteredCharactersByTeam = $derived.by<
    Record<CharacterTeam, ScriptCharacter[]>
  >(() => {
    return Object.fromEntries(
      Object.entries(CHARACTERS_BY_TEAM).map<
        [CharacterTeam, ScriptCharacter[]]
      >(([team, characters]) => [
        team as CharacterTeam,
        characters.filter((character) => {
          let result = true;

          if (teamFilter.size > 0) {
            result &&= teamFilter.has(team);
          }

          if (editionFilter.size > 0) {
            const edition =
              character.id in CHARACTER_METADATA
                ? CHARACTER_METADATA[character.id].edition
                : "custom";
            result &&= editionFilter.has(edition);
          }

          if (search.length > 0) {
            result &&= character.name
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase());
          }

          return result;
        }),
      ])
    ) as Record<CharacterTeam, ScriptCharacter[]>;
  });
</script>

<h2>Select characters</h2>

<div>
  <label class="option" for="name-search">
    <span>Search by name: </span>
    <input
      class="text-input"
      id="name-search"
      name="name-search"
      type="text"
      autocomplete="off"
      bind:value={search}
    />
  </label>
  <div>
    <span>Teams:</span>
    <CharacterSelectList
      characters={TEAM_CHARACTERS}
      selectedSet={teamFilter}
      onCharacterSelect={onTeamSelect}
    />
  </div>
  <div>
    <span>Editions:</span>
    <CharacterSelectList
      characters={EDITION_CHARACTERS}
      selectedSet={editionFilter}
      onCharacterSelect={onEditionSelect}
    />
  </div>
</div>

{#each Object.entries(TEAM_NAMES) as [team, teamName] (team)}
  {#if filteredCharactersByTeam[team as CharacterTeam].length > 0}
    <div class="team-list">
      <h3>{teamName}</h3>
      <CharacterSelectList
        characters={filteredCharactersByTeam[team as CharacterTeam]}
        {selectedSet}
        {onCharacterSelect}
      />
    </div>
  {/if}
{/each}

<style>
  .team-list {
    margin-block: 1rem;
  }
</style>
