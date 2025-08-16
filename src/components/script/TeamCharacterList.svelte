<script lang="ts">
  import type {
    CharacterTeam,
    ScriptCharacter,
  } from "../../generated/script-schema";
  import { draggable, droppable, type DragDropState } from "@thisux/sveltednd";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import CharacterIcon from "../common/CharacterIcon.svelte";
  import { filterInPlace } from "../../lib/util/arrays";
  import { globalState } from "../../lib/state.svelte";
  import { Gripper, Lock, Pinned, Trash } from "svelte-codicons";

  interface Props {
    team: CharacterTeam;
    characters: ScriptCharacter[];
    forced?: { character: ScriptCharacter; reasons: string[] }[];
  }

  const { team, characters, forced }: Props = $props();

  let invalidDrop = $state(false);

  let isDragDropEnabled = $derived(!globalState.options.useSortOrder);

  // Validation function that sets invalidDrop state
  function onDragOver(state: DragDropState<ScriptCharacter>) {
    const character = state.draggedItem;
    if (!character) {
      return;
    }

    // Set invalidDrop based on the color condition
    invalidDrop = character.team !== team;
  }

  function onDrop(state: DragDropState<ScriptCharacter>) {
    if (invalidDrop || !state.draggedItem) {
      return;
    }

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

  function onDragEnd() {
    invalidDrop = false;
  }

  function handleDelete(deletedCharacter: ScriptCharacter) {
    filterInPlace(
      characters,
      (character) => character.id !== deletedCharacter.id
    );
  }
</script>

<ul class="list">
  {#each characters as character, index (character.id)}
    <li
      class={[
        "list-item",
        isDragDropEnabled && "drag-enabled",
        invalidDrop && "drag-error",
      ]}
      use:draggable={{
        container: index.toString(),
        dragData: character,
        interactive: [".delete-button"],
        disabled: !isDragDropEnabled,
      }}
      use:droppable={{
        container: index.toString(),
        callbacks: { onDrop, onDragOver, onDragEnd },
        disabled: !isDragDropEnabled,
      }}
      animate:flip={{ duration: 200 }}
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 150 }}
    >
      {#if isDragDropEnabled}
        <Gripper aria-label={`Drag ${character.name}`} />
      {/if}
      <CharacterIcon class="list-icon" {character} />
      <h3 class="character-name">{character.name}</h3>
      <button
        type="button"
        class="icon-button delete-button"
        onclick={() => handleDelete(character)}
        ><Trash aria-label={`Delete ${character.name}`} /></button
      >
    </li>
  {/each}
  {#if forced !== undefined && forced.length > 0}
    {#each forced as { character, reasons } (character.id)}
      <li
        class="detail-item"
        in:fade={{ duration: 150 }}
        out:fade={{ duration: 150 }}
      >
        <div class="detail-character">
          {#if isDragDropEnabled}
            <Pinned aria-label="Required" />
          {/if}
          <CharacterIcon class="list-icon" {character} />
          <h3 class="character-name">{character.name}</h3>
          <span class="icon-button"><Lock aria-label="Required" /></span>
        </div>
        <div class="detail-detail">
          <ul class="reason-list">
            {#each reasons as reason}
              <li class="reason">{reason}</li>
            {/each}
          </ul>
        </div>
      </li>
    {/each}
  {/if}
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

    &.drag-enabled {
      cursor: move;
    }

    &:global(.dragging) {
      opacity: 0.7;
    }

    &:global(.drag-over) {
      background-color: var(--color-control-background);
      outline: 2px solid var(--color-control-border-active);

      &.drag-error {
        background-color: var(--color-control-background-error);
        outline: 2px solid var(--color-control-border-error);
      }
    }
  }

  .delete-button {
    padding: 0;
  }

  .list-item :global(.icon-container),
  .detail-item :global(.icon-container) {
    width: 48px;
  }

  .character-name {
    flex-grow: 1;
    font-size: 1.2rem;
    font-family: var(--font-title);
  }

  .detail-character {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.5rem;
  }

  .reason-list {
    opacity: 0.7;
    padding-inline-start: calc(24px + 1rem);
  }
</style>
