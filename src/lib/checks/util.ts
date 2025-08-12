import type { ScriptCharacter } from "../../generated/script-schema";
import type { OfficialCharacterId } from "../../generated/types";
import { CHARACTER_METADATA } from "../metadata/characters";
import type { CharacterMetadata } from "../metadata/types";
import type { GlobalState } from "../state.svelte";

const regularCharactersCache = new WeakMap<
  GlobalState,
  { character: ScriptCharacter; meta: CharacterMetadata }[]
>();
const allCharactersCache = new WeakMap<GlobalState, Set<string>>();

export function getCharacterMetadata(
  state: GlobalState,
  id: string
): CharacterMetadata {
  return id in CHARACTER_METADATA
    ? CHARACTER_METADATA[id as OfficialCharacterId]
    : ({
        edition: "custom",
        actionType: "unknown",
      } satisfies CharacterMetadata);
}

export function getAllRegularCharacters(state: GlobalState) {
  if (!regularCharactersCache.has(state)) {
    regularCharactersCache.set(
      state,
      [
        ...state.characters.townsfolk,
        ...state.characters.outsider,
        ...state.characters.minion,
        ...state.characters.demon,
      ].map((character) => ({
        character,
        meta: getCharacterMetadata(state, character.id),
      }))
    );
  }
  return regularCharactersCache.get(state)!;
}

export function hasCharacter(state: GlobalState, id: string) {
  if (!allCharactersCache.has(state)) {
    allCharactersCache.set(
      state,
      new Set(
        [
          ...state.characters.townsfolk,
          ...state.characters.outsider,
          ...state.characters.minion,
          ...state.characters.demon,
          ...state.characters.traveller,
          ...state.characters.fabled,
        ].map((character) => character.id)
      )
    );
  }
  return allCharactersCache.get(state)!.has(id);
}

export function isLikelyTeensySize(state: GlobalState) {
  const size = getAllRegularCharacters(state).length;
  return (
    size <= 13 &&
    state.characters.townsfolk.length <= 8 &&
    state.characters.outsider.length <= 3 &&
    state.characters.minion.length <= 3 &&
    state.characters.demon.length <= 3
  );
}

export function and(
  c1: (state: GlobalState) => boolean,
  c2: (state: GlobalState) => boolean
): (state: GlobalState) => boolean;
export function and(
  c1: (state: GlobalState) => boolean,
  c2: (state: GlobalState) => boolean,
  c3: (state: GlobalState) => boolean
): (state: GlobalState) => boolean;
export function and(
  ...conditions: ((state: GlobalState) => boolean)[]
): (state: GlobalState) => boolean {
  return (state) =>
    conditions.reduce((prev, condition) => prev && condition(state), true);
}

export function or(
  c1: (state: GlobalState) => boolean,
  c2: (state: GlobalState) => boolean
): (state: GlobalState) => boolean;
export function or(
  c1: (state: GlobalState) => boolean,
  c2: (state: GlobalState) => boolean,
  c3: (state: GlobalState) => boolean
): (state: GlobalState) => boolean;
export function or(
  ...conditions: ((state: GlobalState) => boolean)[]
): (state: GlobalState) => boolean {
  return (state) =>
    conditions.reduce((prev, condition) => prev || condition(state), false);
}
