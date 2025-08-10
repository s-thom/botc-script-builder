import type { GlobalState } from "../state.svelte";
import { ALL_CHECKS } from "./checks";
import type { Check, CheckResult } from "./types";

function idle(callback: () => void): () => void {
  if ("requestIdleCallback" in window) {
    const handle = requestIdleCallback(callback, { timeout: 1000 });
    return () => cancelIdleCallback(handle);
  } else {
    const handle = setTimeout(callback, 0);
    return () => clearTimeout(handle);
  }
}

function scheduleCheck<Context>(
  check: Check<Context>,
  state: GlobalState,
  signal: AbortSignal
): Promise<CheckResult | null> {
  return new Promise((res, rej) => {
    const cancel = idle(() => {
      try {
        const cond = check.condition(state);
        if (cond.isRelevant) {
          const result = check.getResult(state, cond.context);
          res(result);
        } else {
          res(null);
        }
      } catch (err) {
        rej(err);
      }
    });

    signal.addEventListener("abort", cancel);
  });
}

export async function runAllChecks(
  state: GlobalState,
  signal: AbortSignal
): Promise<CheckResult[]> {
  const rawCheckResults = await Promise.all(
    ALL_CHECKS.map((check) => scheduleCheck(check, state, signal))
  );
  return rawCheckResults.filter((result) => result != null);
}
