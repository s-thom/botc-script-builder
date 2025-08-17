import type {
  ScriptMetadata,
  CharacterTeam,
  ScriptCharacter,
} from "../../generated/script-schema";

export interface BuilderOptions {
  useSortOrder: boolean;
}

export type AppScreen =
  | "script"
  | "options"
  | "select-characters"
  | "checks"
  | "checks:about";

export interface GlobalStateV1 {
  version: 1;
  meta: ScriptMetadata;
  characters: Record<CharacterTeam, ScriptCharacter[]>;
  unknownCharacters: ScriptCharacter[];
  options: BuilderOptions;
  ui: {
    useChecks: boolean;
    isChecksDrawerOpen: boolean;
    ignoredChecks: string[];
    panelSizes: {
      script: number;
      options: number;
      checks: number;
    };
    screen: AppScreen;
    prevScreen?: AppScreen;
    prompt?: string;
  };
}

export type AllPastStateTypes = GlobalStateV1;

export type GlobalState = GlobalStateV1;

export const CURRENT_STATE_VERSION: GlobalState["version"] = 1;
