import data from "../data/data.json" with { type: "json" };
import type {
  OfficialCharacterDeprecated,
  OfficialCharacterID,
  ScriptCharacter,
  ScriptMetadata,
} from "../generated/script-schema";

export const CHARACTERS_BY_ID = [...data.roles, ...data.fabled].reduce<
  Map<string, ScriptCharacter>
>((map, character) => {
  map.set(character.id, character as ScriptCharacter);
  return map;
}, new Map());

export function getFullScriptCharacter(
  character: ScriptCharacter | OfficialCharacterID | OfficialCharacterDeprecated
): ScriptCharacter {
  if (typeof character === "object" && "team" in character) {
    return character;
  }

  const characterId = typeof character === "string" ? character : character.id;
  const officialCharacter = CHARACTERS_BY_ID.get(characterId);

  if (officialCharacter) {
    return officialCharacter;
  }

  return {
    id: characterId,
    name: characterId,
    team: "<unknown>" as never,
    ability: `<unknown official character ${characterId}>`,
  };
}

export function getMinimalScriptCharacter(
  character: ScriptCharacter
): ScriptCharacter | OfficialCharacterID {
  const officialCharacter = CHARACTERS_BY_ID.get(character.id);
  if (officialCharacter) {
    return officialCharacter.id;
  }

  return character;
}

export function isScriptMetadata(
  item:
    | ScriptCharacter
    | OfficialCharacterID
    | ScriptMetadata
    | OfficialCharacterDeprecated
): item is ScriptMetadata {
  return typeof item === "object" && item.id === "_meta" && !("team" in item);
}
