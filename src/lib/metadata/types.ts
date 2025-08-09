export type CharacterEdition =
  | "tb"
  | "snv"
  | "bmr"
  | "kickstarter"
  | "carousel";

export interface CharacterMetadata {
  id: string;
  edition: CharacterEdition;
}

export type CharacterType = string;
