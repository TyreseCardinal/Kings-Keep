import { moveCardById } from "./cardLifecycleSystem.js";

export function createSiege() {
  const siege = {
    left: [],
    center: [],
    right: [],
  };

  return siege;
}

export function isValidLane(siege, lane) {
  return Object.hasOwn(siege, lane);
}

export function canPlayToSiege(player, card, lane) {
  if (!isValidLane(player.siege, lane)) {
    return false;
  }

  if (player.siege[lane].length !== 0) {
    return false;
  }

  if (card.type === "special" && hasSpecialInSiege(player.siege)) {
    return false;
  }

  return card.type === "number" || card.type === "special";
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

export function getLaneAttackValue(lane) {
  let totalAttack = 0;

  for (const card of lane) {
    totalAttack += card.siegeValue;
  }

  return totalAttack;
}

export function compareLaneAttack(playerALane, playerBLane) {
  const playerAAttack = getLaneAttackValue(playerALane);

  const playerBAttack = getLaneAttackValue(playerBLane);

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
    left: compareLaneAttack(playerA.siege.left, playerB.siege.left),

    center: compareLaneAttack(playerA.siege.center, playerB.siege.center),

    right: compareLaneAttack(playerA.siege.right, playerB.siege.right),
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

  if (matchingSuitCount < 2) {
    return 0;
  }

  return matchingSuitCount;
}

export function getFinalSiegeDamage(
  player,
  siegeResults,
  playerResult,
  activeWall,
) {
  const baseDamage =
    getBaseSiegeDamage(
      player,
      siegeResults,
      playerResult,
    );

  const repetitionCount =
    getSuitRepetitionCount(
      player,
      siegeResults,
      playerResult,
      activeWall,
    );

  if (repetitionCount === 0) {
    return baseDamage;
  }

  return baseDamage * repetitionCount;
}