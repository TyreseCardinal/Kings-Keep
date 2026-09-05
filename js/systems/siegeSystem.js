import { moveCardById } from "./cardLifecycleSystem.js";

import { isSiegeSpecialCard } from "./specialCardSystem.js";

import {
  JACK_MODES,
  isJack,
  getJackAttackValue,
} from "./specialCards/jack/jackSystem.js";

import { isQueen } from "./specialCards/queen/queenSystem.js";

export function createSiege() {
  const siege = {
    left: [],
    center: [],
    right: [],
    specialState: null,
  };

  return siege;
}

export function isValidLane(siege, lane) {
  const validLanes = ["left", "center", "right"];

  return validLanes.includes(lane) && Array.isArray(siege[lane]);
}

export function setSiegeSpecialState(siege, specialState) {
  siege.specialState = specialState;

  return siege.specialState;
}

export function canPlayToSiege(player, card, lane) {
  if (!isValidLane(player.siege, lane)) {
    return false;
  }

  if (player.siege[lane].length !== 0) {
    return false;
  }

  if (isSiegeSpecialCard(card) && hasSpecialInSiege(player.siege)) {
    return false;
  }

  return card.type === "number" || isSiegeSpecialCard(card);
}

export function playSiegeCard(player, card, lane) {
  if (!canPlayToSiege(player, card, lane)) {
    return;
  }

  const source = card.type === "special" ? player.specialHand : player.hand;

  const cardOwnedByPlayer = source.find(
    (ownedCard) => ownedCard.id === card.id,
  );

  if (!cardOwnedByPlayer) {
    return;
  }

  return moveCardById(source, player.siege[lane], card.id);
}

export function getLaneAttackValue(lane, specialState = null) {
  let totalAttack = 0;

  for (const card of lane) {
    if (isJack(card) && specialState?.card === card) {
      totalAttack += getJackAttackValue(specialState);
      continue;
    }

    totalAttack += card.siegeValue;
  }

  return totalAttack;
}

export function compareLaneAttack(
  playerALane,
  playerBLane,
  playerASpecialState = null,
  playerBSpecialState = null,
) {
  const playerAAttack = getLaneAttackValue(playerALane, playerASpecialState);

  const playerBAttack = getLaneAttackValue(playerBLane, playerBSpecialState);

  if (playerAAttack > playerBAttack) {
    return "playerA";
  }

  if (playerBAttack > playerAAttack) {
    return "playerB";
  }

  return "tie";
}

export function resolveSiegeLanes(playerA, playerB) {
  const results = {
    left: compareLaneAttack(
      playerA.siege.left,
      playerB.siege.left,
      playerA.siege.specialState,
      playerB.siege.specialState,
    ),

    center: compareLaneAttack(
      playerA.siege.center,
      playerB.siege.center,
      playerA.siege.specialState,
      playerB.siege.specialState,
    ),

    right: compareLaneAttack(
      playerA.siege.right,
      playerB.siege.right,
      playerA.siege.specialState,
      playerB.siege.specialState,
    ),
  };

  return results;
}

export function getBaseSiegeDamage(player, siegeResults, playerResult) {
  const lanes = ["left", "center", "right"];

  let totalDamage = 0;

  for (const lane of lanes) {
    const card = player.siege[lane][0];

    if (siegeResults[lane] === playerResult && card?.type === "number") {
      totalDamage += card.siegeValue;
    }
  }

  return totalDamage;
}

export function hasSpecialInSiege(siege) {
  return (
    siege.left.some((card) => card.type === "special") ||
    siege.center.some((card) => card.type === "special") ||
    siege.right.some((card) => card.type === "special")
  );
}

export function canActivateSiegeSpecial(player, siegeResults, playerResult) {
  const lanes = ["left", "center", "right"];

  for (const lane of lanes) {
    const card = player.siege[lane][0];

    if (siegeResults[lane] === playerResult && card?.type === "number") {
      return true;
    }
  }

  return false;
}

export function getSiegeSpecial(player) {
  const lanes = ["left", "center", "right"];

  for (const lane of lanes) {
    const card = player.siege[lane][0];

    if (card?.type === "special") {
      return card;
    }
  }

  return null;
}

export function areSiegeSpecialsCancelled(playerA, playerB) {
  const playerASpecial = getSiegeSpecial(playerA);
  const playerBSpecial = getSiegeSpecial(playerB);

  if (playerASpecial === null || playerBSpecial === null) {
    return false;
  }

  if (isJack(playerASpecial) && isJack(playerBSpecial)) {
    const playerAMode = playerA.siege.specialState?.mode;

    const playerBMode = playerB.siege.specialState?.mode;

    return (
      playerAMode === JACK_MODES.DISRUPTION &&
      playerBMode === JACK_MODES.DISRUPTION
    );
  }

  return playerASpecial.rank === playerBSpecial.rank;
}

export function canResolveSiegeSpecial(
  player,
  opponent,
  siegeResults,
  playerResult,
) {
  const special = getSiegeSpecial(player);

  if (special === null) {
    return false;
  }

  if (!canActivateSiegeSpecial(player, siegeResults, playerResult)) {
    return false;
  }

  if (areSiegeSpecialsCancelled(player, opponent)) {
    return false;
  }

  return true;
}

export function didWinAllNumberedLanes(player, laneResults, playerKey) {
  const lanes = ["left", "center", "right"];

  let numberedLaneFound = false;

  for (const lane of lanes) {
    const card = player.siege[lane][0];

    if (card?.type === "number") {
      numberedLaneFound = true;

      if (laneResults[lane] !== playerKey) {
        return false;
      }
    }
  }
  return numberedLaneFound;
}

export function isSiegeSweep(player, opponent, laneResults, playerKey) {
  const wonAllNumberedLanes = didWinAllNumberedLanes(
    player,
    laneResults,
    playerKey,
  );

  if (!wonAllNumberedLanes) {
    return false;
  }

  const special = getSiegeSpecial(player);

  if (special === null) {
    return true;
  }

  return canResolveSiegeSpecial(player, opponent, laneResults, playerKey);
}

export function getSweepSpecialSuit(
  player,
  opponent,
  siegeResults,
  playerResult,
) {
  if (!canResolveSiegeSpecial(player, opponent, siegeResults, playerResult)) {
    return null;
  }

  const special = getSiegeSpecial(player);

  if (isQueen(special) && player.siege.specialState?.card === special) {
    return player.siege.specialState.declaredSuit;
  }

  return special.suit;
}

export function getWinningSiegeCards(player, siegeResults, playerResult) {
  const lanes = ["left", "center", "right"];

  const winningCards = [];

  for (const lane of lanes) {
    const card = player.siege[lane][0];

    if (siegeResults[lane] === playerResult && card?.type === "number") {
      winningCards.push(card);
    }
  }

  return winningCards;
}

export function getSuitRepetitionCount(
  player,
  opponent,
  siegeResults,
  playerResult,
  activeWall,
) {
  const winningCards = getWinningSiegeCards(player, siegeResults, playerResult);

  let matchingSuitCount = 0;

  for (const card of winningCards) {
    if (card.suit === activeWall.suit) {
      matchingSuitCount++;
    }
  }

  const sweepSpecialSuit = getSweepSpecialSuit(
    player,
    opponent,
    siegeResults,
    playerResult,
  );

  if (sweepSpecialSuit === activeWall.suit) {
    matchingSuitCount++;
  }

  if (matchingSuitCount < 2) {
    return 0;
  }

  return matchingSuitCount;
}

export function getRepeatedSiegeDamage(
  player,
  opponent,
  siegeResults,
  playerResult,
  activeWall,
) {
  const repetitionCount = getSuitRepetitionCount(
    player,
    opponent,
    siegeResults,
    playerResult,
    activeWall,
  );

  if (repetitionCount === 0) {
    return 0;
  }

  const winningCards = getWinningSiegeCards(player, siegeResults, playerResult);

  let repeatedDamage = 0;

  for (const card of winningCards) {
    if (card.suit === activeWall.suit) {
      repeatedDamage += card.siegeValue;
    }
  }

  return repeatedDamage;
}

export function getFinalSiegeDamage(
  player,
  opponent,
  siegeResults,
  playerResult,
  activeWall,
) {
  const baseDamage = getBaseSiegeDamage(player, siegeResults, playerResult);

  const repeatedDamage = getRepeatedSiegeDamage(
    player,
    opponent,
    siegeResults,
    playerResult,
    activeWall,
  );

  return baseDamage + repeatedDamage;
}
