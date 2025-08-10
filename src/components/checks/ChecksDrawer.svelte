<script lang="ts">
  import ChecksList from "./ChecksList.svelte";
  import ChecksToolbar from "./ChecksToolbar.svelte";

  interface Props {}

  const {}: Props = $props();

  let isDrawerOpen = $state(false);

  function onTabClick() {
    isDrawerOpen = !isDrawerOpen;
  }
</script>

<div class="drawer">
  <ChecksToolbar
    loading={false}
    errors={0}
    warnings={0}
    info={0}
    {onTabClick}
  />
  {#if isDrawerOpen}
    <ChecksList errors={[]} warnings={[]} info={[]} />
  {/if}
</div>

<style>
</style>
