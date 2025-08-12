<script lang="ts">
  import type { CheckResult } from "../../lib/checks/types";
  import CharacterIcon from "../common/CharacterIcon.svelte";

  interface Props {
    errors: CheckResult[];
    warnings: CheckResult[];
    info: CheckResult[];
  }

  const { errors, warnings, info }: Props = $props();
  const total = $derived(errors.length + warnings.length + info.length);
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
    {#each errors as result (result.id)}
      <li>{result.description}</li>
    {/each}
    {#each warnings as result (result.id)}
      <li>{result.description}</li>
    {/each}
    {#each info as result (result.id)}
      <li>{result.description}</li>
    {/each}
  </ul>
{/if}

<style>
  .checks-list {
    overflow-y: auto;
    height: 300px;
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
