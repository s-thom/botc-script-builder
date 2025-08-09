import data from "../data/data.json" with { type: "json" };
import type {
  CharacterTeam,
  OfficialCharacterDeprecated,
  OfficialCharacterID,
  ScriptCharacter,
  ScriptMetadata,
} from "../generated/script-schema";
import type { OfficialCharacterId } from "../generated/types";
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

function normaliseCharacterId(id: string): string {
  return id.toLowerCase().replace(/_/g, "");
}

export function getFullScriptCharacter(
  character: ScriptCharacter | OfficialCharacterID | OfficialCharacterDeprecated
): ScriptCharacter {
  if (typeof character === "object" && "team" in character) {
    return character;
  }

  const characterId = typeof character === "string" ? character : character.id;
  const officialCharacter = CHARACTERS_BY_ID.get(
    normaliseCharacterId(characterId)
  );

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

// Sort order rules: https://bloodontheclocktower.com/news/sort-order-sao-update
// Note: `!` indicates no asterisk (to ensure "night*" comes after "night")
const SORT_ORDER_PREFIXES = [
  "You start knowing that", // Custom rule. Sorts TB's top 4 better.
  "You start knowing",
  "At night",
  "Each dusk*",
  "Each night!",
  "Each night*",
  "Each day",
  "Once per game, at night!",
  "Once per game, at night*",
  "Once per game, during the day",
  "Once per game",
  "On your 1st night",
  "On your 1st day",
  "You think",
  "You are",
  "You have",
  "You do not know",
  "You might",
  "You",
  "When you die",
  "When you learn that you died",
  "When",
  "If you die",
  "If you died",
  "If you are “mad”",
  "If you",
  "If the Demon dies",
  "If the Demon kills",
  "If the Demon",
  "If both",
  "If there are 5 or more players alive",
  "If",
  "All players",
  "All",
  "The 1st time",
  "The",
  "Good",
  "Evil",
  "Players",
  "Minions",
];
const SORT_ORDER_REGEXES = SORT_ORDER_PREFIXES.map(
  (prefix) =>
    new RegExp(`^${prefix.replace(/\*/g, "\\*").replace(/!/g, "[^*]")}`)
);

const SORT_OVERRIDES: [OfficialCharacterId, OfficialCharacterId][] = [
  ["washerwoman", "librarian"],
  ["washerwoman", "investigator"],
  ["librarian", "investigator"],
];
const SORT_OVERRIDE_LOOKUPS: Partial<
  Record<string, Partial<Record<string, number>>>
> = {};
for (const [a, b] of SORT_OVERRIDES) {
  SORT_OVERRIDE_LOOKUPS[a] ??= {};
  SORT_OVERRIDE_LOOKUPS[a][b] = -1;
  SORT_OVERRIDE_LOOKUPS[b] ??= {};
  SORT_OVERRIDE_LOOKUPS[b][a] = 1;
}

function compareCharacters(a: ScriptCharacter, b: ScriptCharacter): number {
  const override = SORT_OVERRIDE_LOOKUPS[a.id]?.[b.id];
  if (override !== undefined) {
    return override;
  }

  // See which character appears first in the sort order
  for (const regex of SORT_ORDER_REGEXES) {
    const aTest = regex.test(a.ability);
    const bTest = regex.test(b.ability);
    if (aTest && bTest) {
      break;
    }
    if (aTest && !bTest) {
      return -1;
    }
    if (!aTest && bTest) {
      return 1;
    }
  }

  // Both characters are the same in the sort order prefixes. Test length of ability, then name
  const abilityLengthDiff = a.ability.length - b.ability.length;
  if (abilityLengthDiff !== 0) {
    return abilityLengthDiff;
  }
  const nameLengthDiff = a.name.length - b.name.length;
  if (nameLengthDiff !== 0) {
    return nameLengthDiff;
  }

  // Characters have the same length ability and name, sort by character name alphabetically.
  // If two characters have the same ability and name, then that's the script writer's problem.
  // Javascript's sort is unstable, so the order may swap around.
  // I have seen this in practice, where Fall of Rome's High Priest has two identical travellers with different crowns as their icons.
  return a.name.localeCompare(b.name);
}

export function sortCharacters(
  teams: Record<CharacterTeam, ScriptCharacter[]>
): Record<CharacterTeam, ScriptCharacter[]> {
  // TODO: ensure characters are in the correct teams.
  // This should be the case anyway.

  return Object.fromEntries(
    Object.entries(teams).map(([team, characters]) => [
      team,
      [...characters].sort(compareCharacters),
    ])
  ) as Record<CharacterTeam, ScriptCharacter[]>;
}
