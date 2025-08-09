<script lang="ts">
  import type {
    CharacterTeam,
    ScriptCharacter,
  } from "../../generated/script-schema";
  import { globalState } from "../../lib/state.svelte";
  import { filterInPlace } from "../../lib/util/arrays";
  import CharacterIcon from "../common/CharacterIcon.svelte";

  interface Props {
    team: CharacterTeam;
    characters: ScriptCharacter[];
    selectedSet: Set<string>;
  }

  const { team, characters, selectedSet }: Props = $props();

  function onSelectCharacter(character: ScriptCharacter) {
    if (selectedSet.has(character.id)) {
      for (const characters of Object.values(globalState.characters)) {
        filterInPlace(characters, (c) => c.id !== character.id);
      }
    } else {
      globalState.characters[character.team].push(character);
    }
  }
</script>

<ul class="character-list">
  {#each characters as character}
    <li class="character-item">
      <button
        type="button"
        class={[
          "icon-button character",
          `team-${team}`,
          selectedSet.has(character.id) && "selected",
        ]}
        onclick={() => onSelectCharacter(character)}
      >
        <CharacterIcon {character} class="select-icon" />
        <p class="character-name">{character.name}</p>
        {#if selectedSet.has(character.id)}
          <span class="visually-hidden">(selected)</span>
        {/if}
      </button>
    </li>
  {/each}
</ul>

<style>
  .character-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    padding-inline-start: 0;
  }

  .character {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    border: 2px solid transparent;
    border-radius: var(--border-radius);
    padding-inline-end: 8px;

    :global(.select-icon) {
      width: 32px;
    }

    &:hover,
    &:active {
      background-color: var(--color-control-background);
    }

    &:not(.selected) {
      &:hover {
        border-color: var(--color-control-border-hover);
      }
      &:active {
        border-color: var(--color-control-border-active);
      }
    }
    &.selected {
      border-color: var(--color-alignment);
      box-shadow: 0px 0px 5px var(--color-alignment);
    }
  }

  .character-name {
    font-family: var(--font-title);
  }
</style>
