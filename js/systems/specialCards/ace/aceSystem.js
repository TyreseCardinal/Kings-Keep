import {
  getSiegeSpecial,
  canResolveSiegeSpecial,
} from "../../siegeSystem.js";

import { advanceTower } from "../../towerSystem.js";

import {
  isSiegeSpecialCard,
} from "../../specialCardSystem.js";

export function isAce(card) {
  return (
    isSiegeSpecialCard(card) &&
    card.rank === "ace"
  );
}

export function canResolveAce(
  player,
  opponent,
  siegeResults,
  playerResult,
) {
  const special = getSiegeSpecial(player);

  if (!isAce(special)) {
    return false;
  }

  return canResolveSiegeSpecial(
    player,
    opponent,
    siegeResults,
    playerResult,
  );
}

export function resolveAceEffect(
  player,
  opponent,
  siegeResults,
  playerResult,
  opponentWall,
  deadPile,
) {
  if (
    !canResolveAce(
      player,
      opponent,
      siegeResults,
      playerResult,
    )
  ) {
    return false;
  }

  opponentWall.currentHp = 0;

  const newWallState = advanceTower(
    opponent,
    opponentWall,
    deadPile,
  );

  return newWallState;
}