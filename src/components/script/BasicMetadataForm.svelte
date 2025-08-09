<script lang="ts">
  import { globalState } from "../../lib/state.svelte";
</script>

<form class="title-form">
  <h1 class="line">
    <label class="visually-hidden" for="script-title">Script title</label><input
      id="script-title"
      name="script-title"
      class="text-input title-input"
      type="text"
      aria-label="Title"
      autocomplete="off"
      bind:value={globalState.meta.name}
    />
  </h1>
  <p class="line">
    <span>by </span><label class="visually-hidden" for="script-author"
      >Script author</label
    ><input
      id="script-author"
      name="script-author"
      class="text-input"
      type="text"
      aria-label="Author"
      autocomplete="off"
      bind:value={globalState.meta.author}
    />
  </p>
</form>

<style>
  .title-form {
    position: sticky;
    background-color: var(--color-background);
    top: 0;
    padding: 0.5rem;
    margin: -0.5rem;
  }

  .line {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:not(:first-child) {
      margin-block-start: 0.5rem;
    }
    &:not(:last-child) {
      margin-block-end: 0.5rem;
    }
  }

  .title-input {
    font-size: 1.5rem;
  }
</style>
