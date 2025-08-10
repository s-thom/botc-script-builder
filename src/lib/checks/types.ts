import type { OfficialCharacterId } from "../../generated/types";
import type { GlobalState } from "../state.svelte";

interface BaseCheckAction {
  type: string;
}

export interface AddCharacterAction extends BaseCheckAction {
  type: "add-character";
  id: OfficialCharacterId;
}

export type CheckAction = AddCharacterAction;

export interface CheckResult {
  id: string;
  level: "error" | "warning" | "info";
  description: string;
  remarks?: string[];
  actions?: CheckAction[];
}

export interface Check<Context> {
  condition: (
    state: GlobalState
  ) => { isRelevant: false } | { isRelevant: true; context: Context };
  getResult: (state: GlobalState, context: Context) => CheckResult;
}
