import type { BloodOnTheClocktowerCustomScript } from "../generated/script-schema";

export const scriptState = $state<{ script: BloodOnTheClocktowerCustomScript }>(
  { script: [] }
);

export function setScript(script: BloodOnTheClocktowerCustomScript) {
  scriptState.script = script;
}
