import type {
  BloodOnTheClocktowerCustomScript,
  CharacterTeam,
  ScriptCharacter,
  ScriptMetadata,
} from "../generated/script-schema";
import { getFullScriptCharacter, isScriptMetadata } from "./characters";

export interface GlobalState {
  meta: ScriptMetadata;
  characters: Record<CharacterTeam, ScriptCharacter[]>;
  unknownCharacters: ScriptCharacter[];
}

export const globalState = $state<GlobalState>({
  meta: { id: "_meta", name: "" },
  characters: {
    townsfolk: [],
    outsider: [],
    minion: [],
    demon: [],
    traveller: [],
    fabled: [],
  },
  unknownCharacters: [],
});

export function setScript(script: BloodOnTheClocktowerCustomScript) {
  let meta: ScriptMetadata | undefined;
  const characters: Record<CharacterTeam, ScriptCharacter[]> = {
    townsfolk: [],
    outsider: [],
    minion: [],
    demon: [],
    traveller: [],
    fabled: [],
  };
  const unknownCharacters: ScriptCharacter[] = [];

  for (const character of script) {
    if (isScriptMetadata(character)) {
      if (meta === undefined) {
        meta = character;
      } else {
        console.warn("Script has multiple meta sections");
      }
      continue;
    }

    const fullCharacter = getFullScriptCharacter(character);
    // @ts-expect-error `<unknown>` is used as a fallback if there's no way to know what team the character is on.
    // This happens if the script defines a character by string but this app doesn't know what it is.
    if (fullCharacter.team === "<unknown>") {
      unknownCharacters.push(fullCharacter);
    } else {
      characters[fullCharacter.team].push(fullCharacter);
    }
  }

  globalState.meta = meta ?? { id: "_meta", name: "" };
  globalState.characters = characters;
  globalState.unknownCharacters = unknownCharacters;
}
