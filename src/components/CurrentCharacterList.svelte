<script lang="ts">
  import { draggable, droppable, type DragDropState } from "@thisux/sveltednd";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import type { ScriptCharacter } from "../generated/script-schema";
  import CharacterIcon from "./common/CharacterIcon.svelte";
  import { EqualIcon, TrashIcon } from "@lucide/svelte";
  import { globalState } from "../lib/state.svelte";

  function handleDrop(state: DragDropState<ScriptCharacter>) {
    const { characters } = globalState;

    const { draggedItem, targetContainer } = state;
    const dragIndex = characters.findIndex(
      (item) => item.id === draggedItem.id
    );
    const dropIndex = parseInt(targetContainer ?? "0");

    if (dragIndex !== -1 && !isNaN(dropIndex)) {
      const [item] = characters.splice(dragIndex, 1);
      characters.splice(dropIndex, 0, item);
    }
  }

  function handleDelete(deletedCharacter: ScriptCharacter) {
    globalState.characters = globalState.characters.filter(
      (character) => character.id !== deletedCharacter.id
    );
  }
</script>

<ul class="list">
  {#each globalState.characters as character, index (character.id)}
    <li
      class="list-item"
      use:draggable={{
        container: index.toString(),
        dragData: character,
        interactive: [".delete-button"],
      }}
      use:droppable={{
        container: index.toString(),
        callbacks: { onDrop: handleDrop },
      }}
      animate:flip={{ duration: 200 }}
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 150 }}
    >
      <EqualIcon aria-label={`Drag ${character.name}`} />
      <CharacterIcon class="list-icon" {character} />
      <h3 class="character-name">{character.name}</h3>
      <button
        type="button"
        class="icon-button delete-button"
        onclick={() => handleDelete(character)}
        ><TrashIcon aria-label={`Delete ${character.name}`} /></button
      >
    </li>
  {/each}
</ul>

<style>
  .list {
    list-style: none;
    padding-inline-start: 0;
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.5rem;
    border-radius: var(--border-radius);
    transition:
      background-color 0.2s ease-in-out,
      outline 0.2s ease-in-out;
    background-color: transparent;
    outline: 2px solid transparent;

    &:global(.dragging) {
      opacity: 0.7;
    }

    &:global(.drag-over) {
      background-color: var(--color-control-background);
      outline: 2px solid var(--color-control-border-active);
    }
  }

  .list-item :global(.icon-container) {
    width: 48px;
  }

  .character-name {
    flex-grow: 1;
    font-size: 1rem;
  }

  .icon-button {
    border: none;
    background-color: transparent;
    color: inherit;
  }
</style>
