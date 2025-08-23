import {
  CURRENT_STATE_VERSION,
  type AllPastStateTypes,
  type GlobalState,
  type GlobalStateV2,
} from "./types";

const KEY = "botc-script-builder-state";

const DEFAULT_INITIAL_STATE: GlobalState = {
  version: 2,
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
  options: {
    useSortOrder: true,
  },
  ui: {
    theme: "system",
    useChecks: true,
    isChecksDrawerOpen: false,
    ignoredChecks: [],
    panelSizes: { script: 350, options: 350, checks: 300 },
    screen: "script",
  },
};

export function getInitialState(): GlobalState {
  const stored = localStorage.getItem(KEY);
  if (stored) {
    try {
      const state: AllPastStateTypes = JSON.parse(stored);
      if (state.version === CURRENT_STATE_VERSION) {
        return state;
      } else {
        const coerced = state as unknown as GlobalState;

        switch (state.version) {
          case 1:
            coerced.ui.theme = "system";
            return coerced;
        }
        console.warn("Unknown state version, resetting to initial");
      }
    } catch (err) {}
  }

  return DEFAULT_INITIAL_STATE;
}

export function persistState(state: GlobalState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
