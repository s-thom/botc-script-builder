<script lang="ts">
  import { checksState } from "../../lib/state.svelte";
  import CharacterIcon from "../common/CharacterIcon.svelte";
  import CheckItem from "./CheckItem.svelte";

  const total = $derived(
    checksState.errors.length +
      checksState.warnings.length +
      checksState.infos.length
  );
</script>

{#if checksState.didError}
  <div class="checks-list info-area">
    <CharacterIcon
      character={{ id: "goblin", name: "", team: "minion", ability: "" }}
      class="info-area-icon slow-spin"
    />
    <p>Something went wrong while running checks for this script.</p>
  </div>
{:else if total === 0}
  {#if checksState.loading}
    <div class="checks-list info-area">
      <CharacterIcon
        character={{
          id: "nightwatchman",
          name: "",
          team: "townsfolk",
          ability: "",
        }}
        class="info-area-icon slow-spin"
      />
      <p>Running checks...</p>
    </div>
  {:else}
    <div class="checks-list info-area">
      <CharacterIcon
        character={{
          id: "professor",
          name: "",
          team: "townsfolk",
          ability: "",
        }}
        class="info-area-icon slow-spin"
      />
      <p>No errors found!</p>
      <p>
        This does not necessarily mean your script is ready to play. There may
        still be interactions that have undesirable consequences.
      </p>
    </div>
  {/if}
{:else}
  <ul class="checks-list">
    {#each checksState.errors as result}
      <li class="check-item"><CheckItem {result} /></li>
    {/each}
    {#each checksState.warnings as result}
      <li class="check-item"><CheckItem {result} /></li>
    {/each}
    {#each checksState.infos as result}
      <li class="check-item"><CheckItem {result} /></li>
    {/each}
  </ul>
{/if}

<style>
  .checks-list {
    overflow-y: auto;
    list-style: none;
    padding-inline-start: 0;
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
