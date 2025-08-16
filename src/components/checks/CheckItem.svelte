<script lang="ts">
  import {
    Close,
    Error,
    Info,
    TriangleDown,
    TriangleRight,
    Wand,
    Warning,
    type SvgComponent,
  } from "svelte-codicons";
  import type { CheckResult } from "../../lib/checks/types";
  import { CHARACTERS_BY_ID, sortCharacters } from "../../lib/characters";
  import CharacterIcon from "../common/CharacterIcon.svelte";
  import type { ScriptCharacter } from "../../generated/script-schema";
  import { globalState } from "../../lib/state.svelte";

  const LEVEL_ICONS: Record<CheckResult["level"], typeof SvgComponent> = {
    error: Error,
    warning: Warning,
    info: Info,
  };

  interface Props {
    result: CheckResult;
  }

  const { result }: Props = $props();

  const LevelIcon = LEVEL_ICONS[result.level];

  function addCharacter(character: ScriptCharacter) {
    globalState.characters[character.team].push(character);

    if (globalState.options.useSortOrder) {
      globalState.characters = sortCharacters(globalState.characters);
    }
  }

  function ignoreCheck() {
    globalState.ui.ignoredChecks.push(result.id);
  }
</script>

<div class={["check", `level-${result.level}`]}>
  <details>
    <summary class="summary-line">
      <span class="summary-description">
        {#if (result.remarks && result.remarks.length > 0) || (result.actions && result.actions.length > 0)}
          <TriangleRight
            class="summary-icon marker marker-closed"
            aria-label="Expand detail"
          />
          <TriangleDown
            class="summary-icon marker marker-open"
            aria-label="Collapse detail"
          />
        {/if}
        <LevelIcon class="summary-icon" aria-label={result.level} />
        <span>{result.description}</span>
        {#if result.actions && result.actions.length > 0}
          <Wand class="summary-icon" aria-label="Has actions" />
        {/if}
      </span>
      <button type="button" class="icon-button" onclick={ignoreCheck}
        ><Close class="summary-icon" aria-label="Ignore" /></button
      >
    </summary>

    {#if result.remarks && result.remarks.length > 0}
      <ul class="remarks-list">
        {#each result.remarks as remark}
          <li>{remark}</li>
        {/each}
      </ul>
    {/if}

    {#if result.actions && result.actions.length > 0}
      <ul class="actions-list">
        {#each result.actions as action}
          <li class="action-item">
            {#if action.type === "add-character"}
              {@const character = CHARACTERS_BY_ID.get(action.id)}
              {#if character != null}
                <button
                  type="button"
                  class="icon-button action-button"
                  onclick={() => addCharacter(character)}
                >
                  <CharacterIcon {character} class="action-icon" />
                  <span>Add {character.name}</span>
                </button>
              {/if}
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </details>
</div>

<style>
  .check {
    background-color: var(--color-level-background);
    border-block: 1px solid var(--color-level-border);
    padding-inline-start: 0.5rem;
  }

  .summary-line {
    display: flex;
    gap: 0.2rem;

    :global(.summary-icon) {
      flex-shrink: 0;
      width: 1rem;
      vertical-align: sub;
    }
  }

  :global(.marker) {
    &:global(.marker-closed):is(details[open] &),
    &:global(.marker-open):is(details:not([open]) &) {
      display: none;
    }
  }

  .summary-description {
    flex-grow: 1;
  }

  .actions-list {
    display: flex;
    list-style: none;
    padding-inline-start: 0;
  }

  :is(.remarks-list, .actions-list):last-child {
    margin-block-end: 0.2rem;
  }

  .action-item {
    :global(.action-icon) {
      width: 24px;
    }
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    border: 2px solid var(--color-control-border-active);
    border-radius: var(--border-radius);
    padding-inline-end: 8px;

    &:hover,
    &:active {
      background-color: var(--color-control-background);
    }
  }
</style>
