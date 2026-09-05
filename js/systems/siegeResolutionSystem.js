import {
  resolveSiegeLanes,
  getFinalSiegeDamage,
  canResolveSiegeSpecial,
} from "./siegeSystem.js";

import { applyWallDamage, isWallDestroyed } from "./wallSystem.js";

import { advanceTower } from "./towerSystem.js";

import { resolveAceEffect } from "./specialCards/ace/aceSystem.js";

import {
  resolveDisruptionJackFortification,
} from "./specialCards/jack/jackSystem.js";

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

// Check whether this player's Siege Special
// successfully activated.
const specialCanResolve = canResolveSiegeSpecial(
  player,
  opponent,
  siegeResults,
  playerResult,
);

// If the Special is a Disruption Jack,
// destroy the target Wall's Fortification first.
resolveDisruptionJackFortification(
  player.siege.specialState,
  specialCanResolve,
  damageTargetWall,
  deadPile,
);

// Apply the already-calculated numbered Siege damage
// after the Jack effect has resolved.
applyWallDamage(
  damageTargetWall,
  finalDamage,
  deadPile,
);

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
