<script lang="ts">
  import { checksState } from "../../lib/state.svelte";
  import CharacterIcon from "../common/CharacterIcon.svelte";

  const total = $derived(
    checksState.errors.length +
      checksState.warnings.length +
      checksState.infos.length
  );
</script>

{#if total === 0}
  <div class="checks-list no-errors">
    <CharacterIcon
      character={{ id: "professor", name: "", team: "townsfolk", ability: "" }}
      class="no-errors-icon slow-spin"
    />
    <p>No errors found!</p>
    <p>
      This does not necessarily mean your script is ready to play. There may
      still be interactions that have undesirable consequences.
    </p>
  </div>
{:else}
  <ul class="checks-list">
    {#each checksState.errors as result (result.id)}
      <li>{result.description}</li>
    {/each}
    {#each checksState.warnings as result (result.id)}
      <li>{result.description}</li>
    {/each}
    {#each checksState.infos as result (result.id)}
      <li>{result.description}</li>
    {/each}
  </ul>
{/if}

<style>
  .checks-list {
    overflow-y: auto;
  }

  .no-errors {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;

    :global(.no-errors-icon) {
      width: 128px;
    }
  }
</style>
