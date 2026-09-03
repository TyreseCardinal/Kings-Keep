import { resolveSiegeLanes, getFinalSiegeDamage } from "./siegeSystem.js";

import { applyWallDamage, isWallDestroyed } from "./wallSystem.js";

import { advanceTower } from "./towerSystem.js";

import { resolveAceEffect } from "./specialCards/ace/aceSystem.js";

export function resolveSiegeAgainstWall(
  player,
  opponent,
  opponentWall,
  deadPile,
  playerResult,
) {
  const siegeResults = resolveSiegeLanes(player, opponent);

  const finalDamage = getFinalSiegeDamage(
    player,
    opponent,
    siegeResults,
    playerResult,
    opponentWall.card,
  );

  const aceWallState = resolveAceEffect(
    player,
    opponent,
    siegeResults,
    playerResult,
    opponentWall,
    deadPile,
  );

  let damageTargetWall = opponentWall;

  // Ace did successfully resolve.
  if (aceWallState !== false) {
    // Ace destroyed the final Wall and exposed the King.
    // There is no new Wall for Siege damage to hit.
    if (aceWallState === undefined) {
      return {
        siegeResults,
        finalDamage,
        finalWallState: undefined,
      };
    }

    // Ace destroyed a Wall and exposed another Wall.
    damageTargetWall = aceWallState;
  }

  applyWallDamage(damageTargetWall, finalDamage);

  let finalWallState = damageTargetWall;

  if (isWallDestroyed(damageTargetWall)) {
    const advancedWallState = advanceTower(
      opponent,
      damageTargetWall,
      deadPile,
    );

    finalWallState = advancedWallState;
  }

  return {
    siegeResults,
    finalDamage,
    finalWallState,
  };
}
