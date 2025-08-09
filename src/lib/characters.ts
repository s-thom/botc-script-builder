import data from "../data/data.json" with { type: "json" };
import type {
  CharacterTeam,
  OfficialCharacterDeprecated,
  OfficialCharacterID,
  ScriptCharacter,
  ScriptMetadata,
} from "../generated/script-schema";
import type { GlobalState } from "./state.svelte";

export const CHARACTERS_BY_ID = [...data.roles, ...data.fabled].reduce<
  Map<string, ScriptCharacter>
>((map, character) => {
  map.set(character.id, character as ScriptCharacter);
  return map;
}, new Map());

export const CHARACTERS_BY_TEAM = Array.from(CHARACTERS_BY_ID.values()).reduce<
  Record<CharacterTeam, ScriptCharacter[]>
>(
  (obj, character) => {
    if (character.team === undefined || character.edition === "special") {
      return obj;
    }
    console.log(character);
    obj[character.team].push(character);
    return obj;
  },
  {
    townsfolk: [],
    outsider: [],
    minion: [],
    demon: [],
    traveller: [],
    fabled: [],
  }
);
for (const characters of Object.values(CHARACTERS_BY_TEAM)) {
  characters.sort((a, b) => a.name.localeCompare(b.name));
}

export const TEAM_NAMES: Record<CharacterTeam, string> = {
  townsfolk: "Townsfolk",
  outsider: "Outsiders",
  minion: "Minions",
  demon: "Demons",
  traveller: "Travellers",
  fabled: "Fabled",
};

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

export function getEnforcedFabled(
  state: GlobalState
): Map<string, Set<string>> {
  const enforcedFabled = new Map<string, Set<string>>();
  function addFabledReason(fabled: string, reason: string) {
    if (!enforcedFabled.has(fabled)) {
      enforcedFabled.set(fabled, new Set());
    }
    enforcedFabled.get(fabled)!.add(reason);
  }

  if (state.meta.bootlegger && state.meta.bootlegger.length > 0) {
    addFabledReason("bootlegger", "Script contains custom rules");
  }

  const allCharactersMap = new Map<string, ScriptCharacter>();
  for (const characters of Object.values(state.characters)) {
    for (const character of characters) {
      allCharactersMap.set(character.id, character);
    }
  }

  for (const character of allCharactersMap.values()) {
    if (!CHARACTERS_BY_ID.has(character.id)) {
      addFabledReason("bootlegger", "Script contains custom characters");
    }

    if (character.jinxes) {
      for (const jinx of character.jinxes) {
        if (allCharactersMap.has(jinx.id)) {
          addFabledReason("djinn", "Script contains jinxes");
        }
      }
    }
  }

  return enforcedFabled;
}
