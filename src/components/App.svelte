<svelte:options runes />

<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import DesktopLayout from "./layouts/DesktopLayout.svelte";
  import MobileLayout from "./layouts/MobileLayout.svelte";
  import TabletLayout from "./layouts/TabletLayout.svelte";

  const large = new MediaQuery("min-width: 960px");
  const medium = new MediaQuery("min-width: 600px");
</script>

{#if large.current}
  <DesktopLayout />
{:else if medium.current}
  <TabletLayout />
{:else}
  <MobileLayout />
{/if}
