import type { CharacterEdition } from "./types";

export const EDITION_NAMES: Record<CharacterEdition, string> = {
  tb: "Trouble Brewing",
  snv: "Sects and Violets",
  bmr: "Bad Moon Rising",
  kickstarter: "Kickstarter",
  carousel: "Carousel",
};

export const EDITION_ICONS: Record<CharacterEdition, string> = {
  tb: "imp",
  snv: "pithag",
  bmr: "godfather",
  kickstarter: "cannibal",
  carousel: "villageidiot",
};
