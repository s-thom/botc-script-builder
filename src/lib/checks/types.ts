import type { OfficialCharacterId } from "../../generated/types";
import type { RegularCharacterTeam } from "../metadata/types";
import type { GlobalState } from "../state.svelte";

interface BaseCheckAction {
  type: string;
}

export interface AddCharacterAction extends BaseCheckAction {
  type: "add-character";
  id: string;
}

export type CheckAction = AddCharacterAction;

export interface CheckResult {
  id: string;
  level: "error" | "warning" | "info";
  description: string;
  remarks?: string[];
  actions?: CheckAction[];
}

export type Check = (state: GlobalState) => CheckResult | CheckResult[];
