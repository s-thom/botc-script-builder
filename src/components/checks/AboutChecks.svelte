<script lang="ts">
  import { globalState } from "../../lib/state.svelte";
</script>

<div class="desktop-only top-links-list">
  <button
    type="button"
    class="back-link desktop-only link-button"
    onclick={() => {
      globalState.ui.screen = globalState.ui.prevScreen ?? "checks";
      globalState.ui.prevScreen = undefined;
    }}>Back</button
  >
</div>

<h2>About checks</h2>

<p>
  This script builder runs a series of small checks on your script as you are
  building it. They're meant to help build a solid foundation for the script.
</p>

<p>
  These checks are based on common storytelling advice, such as including
  drunkenness/poisoning and modifications to the outsider count. There are other
  more specific ones too, such as making sure the Damsel is on the script if the
  Huntsman is added.
</p>

<p>
  Some of the checks will have actions that can be taken. These usually come in
  the form of adding another character to the script. These are indicated by a
  magic wand icon at the end of the description.
</p>

<p>
  If you find any of these checks getting in your way, you can ignore each of
  them by selecting the ignore button at the end of each line. If you need to
  restore any of them, you can select the "Re-enable all checks" option. If you
  instead want to prevent all checks from running, you can uncheck the "Enable
  checks" option in the app options.
</p>

<h3>What do the different levels mean?</h3>

<p>Checks can either be errors, warnings, or informational.</p>

<ul>
  <li>
    The error level is used for issues that are likely to prevent the script
    from being playable.
  </li>
  <li>
    The warning level is used for issues that won't stop the game from being
    played, but might need some consideration.
  </li>
  <li>
    The info level is used for issues that don't really need to be looked at,
    but might still be useful.
  </li>
</ul>

<h3>Does having warnings mean that the script is bad?</h3>

<p>Absolutely not.</p>

<p>
  While making the checks, I tested against well-known and popular scripts. Some
  of the scripts would have warnings from these checks. These checks don't take
  any external context into account. The only thing capable of truly judging a
  script are the players and storytellers.
</p>

<h3>Does having no warnings mean the script is good?</h3>

<p>
  Again, the only judges of a good script are players and storytellers. You can
  build scripts that pass every check on this site, but are not fun to actually
  play. Your judgement as a script builder is still necessary.
</p>

<style>
  .top-links-list {
    display: flex;
    justify-content: space-between;
    margin-block: 0.5rem;
  }

  .back-link {
    font-size: 1rem;
  }
</style>
