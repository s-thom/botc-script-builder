<svelte:options runes />

<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import DesktopLayout from "./layouts/DesktopLayout.svelte";
  import MobileLayout from "./layouts/MobileLayout.svelte";

  const large = new MediaQuery("min-width: 800px");
</script>

{#if large.current}
  <DesktopLayout />
{:else}
  <MobileLayout />
{/if}
