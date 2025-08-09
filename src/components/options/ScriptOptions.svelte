<script lang="ts">
  import { TrashIcon } from "@lucide/svelte";
  import { globalState } from "../../lib/state.svelte";
  import ExternalImage from "../common/ExternalImage.svelte";
  import { sortCharacters } from "../../lib/characters";

  function addBootleggerRule() {
    globalState.meta.bootlegger ??= [];
    globalState.meta.bootlegger.push("");
  }

  function deleteBootleggerRule(index: number) {
    globalState.meta.bootlegger ??= [];
    globalState.meta.bootlegger.splice(index, 1);
  }
</script>

<form class="script-options">
  <div class="section">
    <h3>Script options</h3>

    <div class="image-option-container">
      <label class="option" for="script-logo">
        <span>Logo</span>
        <input
          class="text-input"
          id="script-logo"
          name="script-logo"
          type="text"
          autocomplete="off"
          bind:value={globalState.meta.logo}
        />
      </label>
      {#if globalState.meta.logo !== undefined && globalState.meta.logo !== ""}
        <ExternalImage
          src={globalState.meta.logo}
          alt="Logo"
          class="image-option-image"
        />
      {/if}
    </div>

    <div class="image-option-container">
      <label class="option" for="script-background">
        <span>Background</span>
        <input
          class="text-input"
          id="script-background"
          name="script-background"
          type="text"
          autocomplete="off"
          bind:value={globalState.meta.background}
        />
      </label>
      {#if globalState.meta.background !== undefined && globalState.meta.background !== ""}
        <ExternalImage
          src={globalState.meta.background}
          alt="Background"
          class="image-option-image"
        />
      {/if}
    </div>

    <label class="option" for="script-almanac">
      <span>Almanac link</span>
      <input
        class="text-input"
        id="script-almanac"
        name="script-almanac"
        type="text"
        autocomplete="off"
        bind:value={globalState.meta.almanac}
      />
    </label>

    <label class="option" for="script-hideTitle">
      <span
        ><input
          id="script-hideTitle"
          name="script-hideTitle"
          type="checkbox"
          autocomplete="off"
          value="hideTitle"
          bind:checked={globalState.meta.hideTitle}
        /> Hide title?</span
      >
      <p class="hint">
        Hides the title of the script when imported into the official app.
      </p>
    </label>
  </div>

  <div class="section">
    <h3>Bootlegger rules</h3>

    <p class="hint">
      Adding bootlegger rules will automatically add the Bootlegger fabled into
      the script.
    </p>

    {#if globalState.meta.bootlegger !== undefined && globalState.meta.bootlegger.length > 0}
      <ul class="bootlegger-list">
        {#each globalState.meta.bootlegger as rule, index}
          <li class="bootlegger-rule">
            <input
              class="text-input"
              type="text"
              aria-label="Rule"
              autocomplete="off"
              bind:value={rule}
            />
            <button
              type="button"
              class="icon-button delete-button"
              onclick={() => deleteBootleggerRule(index)}
              ><TrashIcon aria-label="Delete rule" /></button
            >
          </li>
        {/each}
      </ul>
    {/if}

    <button class="button" type="button" onclick={addBootleggerRule}
      >Add rule</button
    >
  </div>
  <div class="section">
    <h3>App options</h3>

    <label class="option" for="app-sortOrder">
      <span
        ><input
          id="app-sortOrder"
          name="app-sortOrder"
          type="checkbox"
          autocomplete="off"
          value="hideTitle"
          bind:checked={
            () => globalState.options.useSortOrder,
            (value) => {
              globalState.options.useSortOrder = value;
              if (value) {
                globalState.characters = sortCharacters(globalState.characters);
              }
            }
          }
        /> Use sort order</span
      >
      <p class="hint">
        Automatically sort scripts using the official <a
          href="https://bloodontheclocktower.com/news/sort-order-sao-update"
          rel="external noreferrer">sort order</a
        >.
      </p>
    </label>
  </div>
</form>

<style>
  .script-options {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-block: 0.5rem;
  }

  .image-option-container,
  .option:not(.image-option-container .option) {
    margin: 0.2rem;
  }

  .image-option-container {
    display: flex;
    align-items: center;
    gap: 0.2rem;

    .option {
      flex-grow: 1;
    }

    :global(.image-option-image) {
      width: 64px;
      max-height: 64px;

      :global(.image) {
        object-fit: contain;
      }
    }
  }

  .hint {
    opacity: 0.7;
    margin-top: 0.2rem;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-block: 0.5rem;
  }

  .bootlegger-list {
    padding-inline-start: 0;
    list-style-type: none;
  }

  .bootlegger-rule {
    display: flex;
    gap: 0.2rem;
    margin-block: 0.2rem;

    .text-input {
      flex-grow: 1;
    }
  }
</style>
