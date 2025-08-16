import type { ScriptCharacter } from "../../generated/script-schema";
import { CHARACTERS_BY_ID } from "../characters";
import type { Check, CheckResult } from "./types";
import {
  getAllRegularCharacters,
  hasCharacter,
  isLikelyTeensySize,
} from "./util";

export const ALL_CHECKS: Check[] = [
  function unknownCharacters(state) {
    if (state.unknownCharacters.length > 0) {
      return {
        id: "app/unknown",
        level: "error",
        description: `Imported script has official characters that this script builder does not know about: ${state.unknownCharacters.map((character) => character.id).join(", ")}, but this script builder does not have information about it`,
      };
    }

    return [];
  },
  function title(state) {
    return state.meta.name === "" && !state.meta.hideTitle
      ? {
          id: "meta/title",
          level: "info",
          description: "Script does not have a title",
          remarks: [
            "While optional, giving your script a title can help storytellers find interesting scripts based around concepts",
            'If you do not want the title to be shown in the official Blood on the Clocktower app, you can enable the "Hide title" option in the script options',
          ],
        }
      : [];
  },
  function author(state) {
    return state.meta.name === "" && !state.meta.hideTitle
      ? {
          id: "meta/author",
          level: "info",
          description: "Script does not have an author",
          remarks: [
            "While optional, putting your name next to the script can help storytellers find scripts you've made if uploaded to a script sharing website",
            "All scripts are the intellectual property of The Pandemonium Institute. Putting your name against a script does not give you any ownership over it",
          ],
        }
      : [];
  },
  function townsfolkCount(state) {
    const isTeensy = isLikelyTeensySize(state);
    const numTownsfolk = state.characters.townsfolk.length;
    const baseTownsfolkCount = isTeensy ? 6 : 13;

    switch (numTownsfolk) {
      case 0:
        return {
          id: "teams/townsfolk",
          level: "error",
          description: "Script has no townsfolk",
        };
      case baseTownsfolkCount:
        return [];
      default:
        return {
          id: "teams/townsfolk",
          level: "warning",
          description: `A ${isTeensy ? "teensy " : ""}script usually has ${baseTownsfolkCount} townsfolk`,
        };
    }
  },
  function outsiderCount(state) {
    const isTeensy = isLikelyTeensySize(state);
    const numOutsiders = state.characters.outsider.length;
    const baseOutsiderCount = isTeensy ? 2 : 4;

    switch (numOutsiders) {
      case 0:
        return {
          id: "teams/outsider",
          level: "error",
          description: "Script has no outsiders",
        };
      case baseOutsiderCount:
        return [];
      default:
        return {
          id: "teams/outsider",
          level: "warning",
          description: `A ${isTeensy ? "teensy " : ""}script usually has ${baseOutsiderCount} outsiders`,
        };
    }
  },
  function minionCount(state) {
    const isTeensy = isLikelyTeensySize(state);
    const numMinions = state.characters.minion.length;
    const baseMinionCount = isTeensy ? 2 : 4;

    const extraMinionDemonCount =
      !isTeensy && state.characters.demon.length < 4;
    const extraMinionSoloLordOfTyphon =
      !isTeensy &&
      state.characters.demon.length === 1 &&
      hasCharacter(state, "lordoftyphon");

    const extraMinionCharacters: ScriptCharacter[] = [];
    const allRegular = getAllRegularCharacters(state);
    for (const { character, meta } of allRegular) {
      if (meta.needsExtraMinion) {
        extraMinionCharacters.push(character);
      }
    }

    const shouldHaveExtraMinion =
      !isTeensy &&
      (extraMinionCharacters.length > 0 ||
        extraMinionDemonCount ||
        extraMinionSoloLordOfTyphon);

    const actualExpectedNumMinions =
      baseMinionCount + (shouldHaveExtraMinion ? 1 : 0);

    if (numMinions === 0) {
      return {
        id: "teams/minion",
        level: "error",
        description: "Script has no minions",
      };
    }

    if (numMinions === actualExpectedNumMinions) {
      return [];
    }

    if (shouldHaveExtraMinion) {
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

      return {
        id: "teams/minion",
        level: numMinions === baseMinionCount ? "info" : "warning", // Downgrade to info if at base number
        description: `A ${isTeensy ? "teensy " : ""}script usually has ${baseMinionCount} minions, but an extra minion might help the evil team`,
        remarks,
      };
    }

    return {
      id: "teams/minion",
      level: "warning",
      description: `A ${isTeensy ? "teensy " : ""}script usually has ${baseMinionCount} minions`,
    };
  },
  function demonCount(state) {
    const isTeensy = isLikelyTeensySize(state);
    const numDemons = state.characters.demon.length;
    const baseDemonCount = isTeensy ? 2 : 4;

    if (numDemons === 0) {
      return {
        id: "teams/demon",
        level: "error",
        description: "Script has no demons",
      };
    }

    if (numDemons > baseDemonCount) {
      return {
        id: "teams/demon",
        level: "warning",
        description: `A ${isTeensy ? "teensy " : ""}script usually has ${isTeensy ? "1 to 2 " : "up to 4"} demons`,
      };
    }

    return [];
  },
  function characterNeeds(state) {
    const results: CheckResult[] = [];

    const allRegular = getAllRegularCharacters(state);
    for (const { character, meta } of allRegular) {
      if (meta.requiresCharacters) {
        for (const requiredCharacterId of meta.requiresCharacters) {
          if (hasCharacter(state, requiredCharacterId)) {
            continue;
          }

          const requiredCharacterData =
            CHARACTERS_BY_ID.get(requiredCharacterId);

          results.push({
            id: `abilities/needs:${character.id}+${requiredCharacterId}`,
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
    const extraEvils = allRegular.filter(({ meta }) => {
      return meta.causesExtraEvil;
    }, 0);

    return extraEvils.length > 1
      ? {
          id: "abilities/extra-evil",
          level: "warning",
          description: `There are multiple ways for players to be turned evil: ${extraEvils.map(({ character }) => character.name).join(", ")}`,
          remarks: [
            "Having multiple evil-turned players can result in an unbeatable voting majority for evil",
            "The Spirit of Ivory fabled prevents more than one extra player from being evil at a time",
          ],
          actions: [{ type: "add-character", id: "spiritofivory" }],
        }
      : [];
  },
  function bluffDeaths(state) {
    const allRegular = getAllRegularCharacters(state);
    const { good, evil } = allRegular.reduce<{
      good: ScriptCharacter[];
      evil: ScriptCharacter[];
    }>(
      (acc, { character, meta }) => {
        if (meta.causesExtraNightDeaths) {
          switch (character.team) {
            case "townsfolk":
            case "outsider":
              acc.good.push(character);
              break;
            case "minion":
            case "demon":
              acc.evil.push(character);
              break;
          }
        }

        return acc;
      },
      { good: [], evil: [] }
    );

    if (evil.length > 0 && good.length === 0) {
      return {
        id: "abilities/extra-deaths",
        level: "warning",
        description: `There are evil characters that cause additional deaths at night, but no good characters to bluff as: ${evil.map((character) => character.name).join(", ")}`,
        remarks: [
          "Good characters that cause deaths in the night can cover up evil actions",
        ],
      };
    }
    if (good.length > 0 && evil.length === 0) {
      return {
        id: "abilities/extra-deaths",
        level: "warning",
        description: `There are good characters that cause additional deaths, but no evil characters that could have caused them: ${good.map((character) => character.name).join(", ")}`,
        remarks: [
          "Only having good characters that cause deaths might be too confirmatory and make it difficult for evil to bluff",
        ],
      };
    }

    return [];
  },
  function bluffResurrection(state) {
    const allRegular = getAllRegularCharacters(state);
    const { good, evil } = allRegular.reduce<{
      good: ScriptCharacter[];
      evil: ScriptCharacter[];
    }>(
      (acc, { character, meta }) => {
        if (meta.causesResurrection) {
          switch (character.team) {
            case "townsfolk":
            case "outsider":
              acc.good.push(character);
              break;
            case "minion":
            case "demon":
              acc.evil.push(character);
              break;
          }
        }

        return acc;
      },
      { good: [], evil: [] }
    );

    if (evil.length > 0 && good.length === 0) {
      return {
        id: "abilities/resurrection",
        level: "warning",
        description: `There are evil characters that cause resurrections, but no good characters to bluff as: ${evil.map((character) => character.name).join(", ")}`,
        remarks: [
          "Good characters that resurrect in the night can cover up evil actions",
        ],
      };
    }
    if (good.length > 0 && evil.length === 0) {
      return {
        id: "abilities/resurrection",
        level: "warning",
        description: `There are good characters that cause resurrections, but no evil characters that could have caused them: ${good.map((character) => character.name).join(", ")}`,
        remarks: [
          "Only having good characters that resurrect might be too confirmatory and make it difficult for evil to bluff",
        ],
      };
    }

    return [];
  },
  function bluffConsult(state) {
    const allRegular = getAllRegularCharacters(state);
    const consultCharacters = allRegular.reduce<ScriptCharacter[]>(
      (acc, { character, meta }) => {
        if (meta.actionType === "storyteller-consult") {
          acc.push(character);
        }

        return acc;
      },
      []
    );

    if (consultCharacters.length === 1) {
      return {
        id: "abilities/consult",
        level: "warning",
        description: `There is only one character that visibly consults the storyteller: ${consultCharacters.map((character) => character.name).join(", ")}`,
        remarks: [
          "Only having one ability that consults the storyteller makes it difficult for evil to bluff",
        ],
      };
    }

    return [];
  },
  function outsiderMod(state) {
    const allRegular = getAllRegularCharacters(state);
    const numOutsiderMod = allRegular.reduce(
      (sum, { meta }) => sum + (meta.outsiderModification ? 1 : 0),
      0
    );

    if (numOutsiderMod === 0 && !hasCharacter(state, "sentinel")) {
      return {
        id: "abilities/outsider-mod",
        level: "warning",
        description:
          "There are no abilities that modify the number of outsiders",
        remarks: [
          "Having a known number of outsiders makes it harder for evil to bluff as outsiders",
          "The Sentinel fabled allows the outsider count to be modified when building a game",
        ],
        actions: [{ type: "add-character", id: "sentinel" }],
      };
    }

    return [];
  },
  function droisoning(state) {
    const allRegular = getAllRegularCharacters(state);
    const numDroisoning = allRegular.reduce(
      (sum, { meta }) => sum + (meta.causesDroison ? 1 : 0),
      0
    );

    if (numDroisoning === 0 && !hasCharacter(state, "fibbin")) {
      return {
        id: "abilities/droison",
        level: "warning",
        description:
          "There are no abilities that cause drunkenness or poisoning",
        remarks: [
          "Misinformation is an important part of evil's ability to steer the game",
          "The Fibbin fabled allows the storyteller to give misinformation once per game",
        ],
        actions: [{ type: "add-character", id: "fibbin" }],
      };
    }

    return [];
  },
  function startsKnowing(state) {
    const allRegular = getAllRegularCharacters(state);
    const numStartKnowing = allRegular.reduce(
      (sum, { character, meta }) =>
        sum +
        (character.team === "townsfolk" && meta.actionType === "start-knowing"
          ? 1
          : 0),
      0
    );

    if (numStartKnowing === 0) {
      return {
        id: "abilities/starts-knowing",
        level: "warning",
        description:
          "There are no townsfolk abilities that start knowing information",
      };
    }

    return [];
  },
  function ongoing(state) {
    const allRegular = getAllRegularCharacters(state);
    const numStartKnowing = allRegular.reduce(
      (sum, { character, meta }) =>
        sum +
        (character.team === "townsfolk" &&
        (meta.actionType === "each-night-all" ||
          meta.actionType === "each-night-star")
          ? 1
          : 0),
      0
    );

    if (numStartKnowing === 0 && !hasCharacter(state, "duchess")) {
      return {
        id: "abilities/ongoing",
        level: "warning",
        description:
          "There are no townsfolk abilities that learn information throughout the game",
        remarks: [
          "The Duchess fabled provides powerful information each night",
        ],
        actions: [{ type: "add-character", id: "duchess" }],
      };
    }

    return [];
  },
  function numJinxes(state) {
    const allRegular = getAllRegularCharacters(state);

    let numJinxes = 0;
    for (const { character } of allRegular) {
      if (character.jinxes) {
        for (const jinx of character.jinxes) {
          if (hasCharacter(state, jinx.id)) {
            numJinxes++;
          }
        }
      }
    }

    if (numJinxes > 5) {
      return {
        id: "abilities/jinxes",
        level: "warning",
        description: `Script has ${numJinxes} jinxes`,
        remarks: [
          "Too many jinxes can lead to confusion around rules and interactions between characters on the script",
        ],
      };
    }

    return [];
  },
];
