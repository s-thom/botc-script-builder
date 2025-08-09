<script lang="ts">
  import { getScript, globalState, setScript } from "../../lib/state.svelte";
  import tb from "../../generated/edition-scripts/tb.json";
  import { parseOrFetchScript } from "../../lib/import";

  let isShowingImport = $state(false);
  let isImporting = $state(false);
  let scriptInputValue = $state("");
  let scriptInputError = $state<string | undefined>(undefined);

  function downloadJson() {
    const script = getScript();
    const scriptFilename = `${(globalState.meta.name || "script").replace(/[\\/:*?"<>|]+/g, "_")}.json`;

    const blob = new Blob([JSON.stringify(script)], {
      type: "application/json",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = scriptFilename;
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  async function importScript(event: Event) {
    event.preventDefault();

    isImporting = true;
    scriptInputError = undefined;

    try {
      const newScript = await parseOrFetchScript(scriptInputValue);
      setScript(newScript);
      isShowingImport = false;
    } catch (err) {
      scriptInputError = "Error importing script";
    } finally {
      isImporting = false;
    }
  }
</script>

<p>
  <button
    type="button"
    onclick={() => {
      setScript(tb);
    }}>set script to tb</button
  >
</p>

<div class="action-list">
  <button
    type="button"
    class="button"
    onclick={() => (isShowingImport = !isShowingImport)}>Import script</button
  >
  <button
    type="button"
    class="button"
    onclick={downloadJson}
    data-umami-event="script-export-json">Export JSON</button
  >
</div>

{#if isShowingImport}
  <form class="import-form" onsubmit={importScript}>
    <label for="script">Script JSON or URL</label>
    <textarea
      class="text-input"
      name="script"
      id="script"
      required
      bind:value={scriptInputValue}
      aria-describedby="script-error"
    ></textarea>
    <button
      type="submit"
      class="button"
      disabled={isImporting}
      data-umami-event="script-import"
    >
      Import
    </button>
  </form>
{/if}

<style>
  .action-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .import-form {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-block: 0.5rem;
  }
</style>
