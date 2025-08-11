import type { GlobalState } from "../state.svelte";
import { scheduleTask } from "../util/async";
import { ALL_CHECKS } from "./checks";
import type { CheckResult } from "./types";

export async function runAllChecks(
  state: GlobalState,
  signal: AbortSignal
): Promise<CheckResult[]> {
  const rawCheckResults = await Promise.all(
    ALL_CHECKS.map((check) => scheduleTask(() => check(state), signal))
  );
  return rawCheckResults.flat().filter((result) => result != null);
}
