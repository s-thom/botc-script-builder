import type {
  CharacterTeam,
  ScriptCharacter,
} from "../../generated/script-schema";
import { CHARACTERS_BY_ID } from "../characters";
import { truthyOnly } from "../util/arrays";
import type { Check, CheckResult } from "./types";
import {
  getAllRegularCharacters,
  getCharacterMetadata,
  hasCharacter,
  isLikelyTeensySize,
} from "./util";

export const ALL_CHECKS: Check[] = [
  function characterTypeCount(state) {
    // This is likely to be one of the most complicated of the lot, as there are nuances here.
    // I think it makes sense to bundle all this together, but it does make for some weird code.

    const missingTypes: CharacterTeam[] = [];
    if (state.characters.townsfolk.length === 0) {
      missingTypes.push("townsfolk");
    }
    if (state.characters.outsider.length === 0) {
      missingTypes.push("outsider");
    }
    if (state.characters.minion.length === 0) {
      missingTypes.push("minion");
    }
    if (state.characters.demon.length === 0) {
      missingTypes.push("demon");
    }
    if (missingTypes.length > 0) {
      return [
        {
          id: "no-character-type",
          description: `Script is missing characters of the following types: ${missingTypes.join(", ")}`,
          level: "error",
        },
      ];
    }

    const allRegular = getAllRegularCharacters(state);
    const isTeensy = isLikelyTeensySize(state);

    const extraMinionDemonCount =
      !isTeensy && state.characters.demon.length < 4;
    const extraMinionSoloLordOfTyphon =
      !isTeensy &&
      state.characters.demon.length === 1 &&
      hasCharacter(state, "lordoftyphon");
    const extraMinionCharacters: ScriptCharacter[] = [];
    for (const character of allRegular) {
      const meta = getCharacterMetadata(state, character.id);
      if (meta.needsExtraMinion) {
        extraMinionCharacters.push(character);
      }
    }

    const shouldHaveExtraMinion =
      extraMinionCharacters.length > 0 ||
      extraMinionDemonCount ||
      extraMinionSoloLordOfTyphon;

    const baseNonDemonCounts: [number, number, number] = isTeensy
      ? [6, 2, 2]
      : [13, 4, 4];

    const results: CheckResult[] = [];

    if (state.characters.townsfolk.length !== baseNonDemonCounts[0]) {
      results.push({
        id: "teams/townsfolk",
        level: "warning",
        description: `A ${isTeensy ? "teensy " : ""}script usually has ${baseNonDemonCounts[0]} townsfolk`,
      });
    }
    if (state.characters.outsider.length !== baseNonDemonCounts[1]) {
      results.push({
        id: "teams/outsiders",
        level: "warning",
        description: `A ${isTeensy ? "teensy " : ""}script usually has ${baseNonDemonCounts[1]} outsiders`,
      });
    }
    if (!isTeensy && shouldHaveExtraMinion) {
      if (state.characters.minion.length !== baseNonDemonCounts[2] + 1) {
        const remarks = extraMinionCharacters.map((character) => {
          switch (character.id) {
            case "alchemist":
              return "The Alchemist puts an extra minion ability into play, so adding another minion type provides ambiguity as to which minions are in play";
            case "lilmonsta":
              return "Lil' Monsta puts an extra minion ability into play, so adding another minion type provides ambiguity as to which minions are in play";
            default:
              return `${character.name} has indicated that an extra minion might be helpful`;
          }
        });

        if (extraMinionSoloLordOfTyphon) {
          remarks.push(
            "A solo Lord of Typhon puts an extra minion ability into play, so adding another minion type provides ambiguity as to which minions are in play"
          );
        } else if (extraMinionDemonCount) {
          remarks.push(
            "Solo demon scripts might benefit from having an extra minion type"
          );
        }

        results.push({
          id: "teams/minions:extra",
          level: "warning",
          description: "An extra minion may be needed", // TODO: a better description when there are too many selected
          remarks,
        });
      }
    } else {
      if (state.characters.minion.length < baseNonDemonCounts[2]) {
        results.push({
          id: "teams/minions",
          level: "warning",
          description: `A ${isTeensy ? "teensy " : ""}script usually has ${baseNonDemonCounts[2]} minions`,
        });
      }
    }

    return results;
  },
  function characterNeeds(state) {
    const results: CheckResult[] = [];

    const allRegular = getAllRegularCharacters(state);
    for (const character of allRegular) {
      const meta = getCharacterMetadata(state, character.id);
      if (meta.requiresCharacters) {
        for (const requiredCharacterId of meta.requiresCharacters) {
          const requiredCharacterData =
            CHARACTERS_BY_ID.get(requiredCharacterId);

          results.push({
            id: `character/requires:${character.id}+${requiredCharacterId}`,
            level: "error",
            description: `The ${character.name} needs ${requiredCharacterData ? requiredCharacterData.name : `"${requiredCharacterId}"`} to also be on the script`,
            actions: requiredCharacterData
              ? [{ type: "add-character", id: requiredCharacterData.id }]
              : undefined,
          });
        }
      }
    }

    return results;
  },
  function numEvilTurn(state) {
    const allRegular = getAllRegularCharacters(state);
    const extraEvils = allRegular.filter((character) => {
      const meta = getCharacterMetadata(state, character.id);
      return meta.causesExtraEvil;
    }, 0);

    return extraEvils.length > 1
      ? [
          {
            id: "balance/extra-evil",
            level: "warning",
            description: `There are multiple ways for players to be turned evil: ${extraEvils.map((character) => character.name).join(", ")}`,
            remarks: [
              "Having multiple evil-turned players can result in an unbeatable voting majority for evil",
              "The Spirit of Ivory fabled prevents more than one extra player from being evil at a time",
            ],
            actions: [{ type: "add-character", id: "spiritofivory" }],
          },
        ]
      : [];
  },
];
