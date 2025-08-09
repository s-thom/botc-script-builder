export type CharacterEdition =
  | "tb"
  | "snv"
  | "bmr"
  | "kickstarter"
  | "carousel"
  | "custom";

export interface EditionMetadata {
  name: string;
  icon: string;
}

export interface CharacterMetadata {
  edition: CharacterEdition;
}
