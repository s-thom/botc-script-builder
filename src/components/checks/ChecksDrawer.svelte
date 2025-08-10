<script lang="ts">
  import { getAbortSignal } from "svelte";
  import ChecksList from "./ChecksList.svelte";
  import ChecksToolbar from "./ChecksToolbar.svelte";
  import { runAllChecks } from "../../lib/checks";
  import { globalState } from "../../lib/state.svelte";
  import type { CheckResult } from "../../lib/checks/types";
  import { groupBy } from "../../lib/util/arrays";
  import { delay } from "../../lib/util/async";

  let isDrawerOpen = $state(false);
  let isLoading = $state(false);
  let checkResults = $state<CheckResult[]>([]);

  function onTabClick() {
    isDrawerOpen = !isDrawerOpen;
  }

  $effect(() => {
    const signal = getAbortSignal();
    const state = $state.snapshot(globalState);
    isLoading = true;

    delay(300, signal)
      .then(() => runAllChecks(state, signal))
      .then((results) => {
        checkResults = results;
        isLoading = false;
      });
  });

  const {
    error = [],
    warning = [],
    info = [],
  } = $derived.by(() => groupBy(checkResults, (result) => result.level));
</script>

<div class="drawer">
  <ChecksToolbar
    loading={false}
    errors={error.length}
    warnings={warning.length}
    info={info.length}
    {onTabClick}
  />
  {#if isDrawerOpen}
    <ChecksList errors={error} warnings={warning} {info} />
  {/if}
</div>

<style>
</style>
