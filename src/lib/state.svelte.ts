import type {
  BloodOnTheClocktowerCustomScript,
  ScriptCharacter,
  ScriptMetadata,
} from "../generated/script-schema";
import { getFullScriptCharacter, isScriptMetadata } from "./characters";

export interface GlobalState {
  meta: ScriptMetadata;
  characters: ScriptCharacter[];
}

export const globalState = $state<GlobalState>({
  meta: { id: "_meta", name: "" },
  characters: [],
});

export function setScript(script: BloodOnTheClocktowerCustomScript) {
  const meta = script.find((item) => isScriptMetadata(item));
  const characters = script
    .filter((item) => !isScriptMetadata(item))
    .map((item) => getFullScriptCharacter(item));

  globalState.meta = meta ?? { id: "_meta", name: "" };
  globalState.characters = characters;
}
