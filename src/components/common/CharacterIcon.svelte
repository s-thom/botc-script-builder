<script module>
  import type {
    CharacterTeam,
    ScriptCharacter,
  } from "../../generated/script-schema";
  import * as CHARACTER_ICONS from "../../generated/character-icons";
  import { ALLOWED_EXTERNAL_HOSTNAMES } from "../../lib/images";

  export interface CharacterIconProps {
    character: ScriptCharacter;
  }

  function getCharacterIconUrl(character: ScriptCharacter): string | null {
    const teamFallbackIcon =
      character.team in CHARACTER_ICONS
        ? CHARACTER_ICONS[character.team]
        : null;

    if (character.image) {
      let imageUrl: string;
      if (typeof character.image === "string") {
        imageUrl = character.image;
      } else if (Array.isArray(character.image) && character.image.length > 0) {
        imageUrl = character.image[0];
      } else {
        return teamFallbackIcon;
      }

      const url = new URL(imageUrl);
      if (!url) {
        return null;
      }

      if (!ALLOWED_EXTERNAL_HOSTNAMES.includes(url.hostname)) {
        return teamFallbackIcon;
      }

      return imageUrl;
    }

    if (character.id in CHARACTER_ICONS) {
      return (CHARACTER_ICONS as Record<string, string>)[character.id];
    } else {
      return teamFallbackIcon;
    }
  }
</script>

<script lang="ts">
  const { character }: CharacterIconProps = $props();

  const src = getCharacterIconUrl(character);
</script>

{#if src != null}
  <img {src} alt="" />
{:else}
  <div></div>
{/if}

<style>
</style>
