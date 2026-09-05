import {
  moveCardById,
} from "./cardLifecycleSystem.js";

import {
  createWallState,
} from "./wallSystem.js";

import {
  destroyFortification,
} from "./fortificationSystem.js";

export function canConvert(activeWall, card) {
  if (!activeWall || !card) {
    return false;
  }

  if (card.type !== "number") {
    return false;
  }

  return activeWall.card.suit === card.suit;
}

export function convertWall(
  player,
  activeWall,
  card,
  deadPile,
) {
  if (!canConvert(activeWall, card)) {
    return;
  }

  const cardInHand = player.hand.find(
    (handCard) => handCard.id === card.id,
  );

  if (!cardInHand) {
    return;
  }

  if (activeWall.fortification !== null) {
    destroyFortification(
      activeWall,
      deadPile,
    );
  }

  const oldWallCard = activeWall.card;

  const oldWallIndex = player.tower.findIndex(
    (towerCard) => towerCard.id === oldWallCard.id,
  );

  if (oldWallIndex === -1) {
    return;
  }

  moveCardById(
    player.tower,
    deadPile,
    oldWallCard.id,
  );

  moveCardById(
    player.hand,
    player.tower,
    card.id,
  );

  const newWallCard = player.tower[
    player.tower.length - 1
  ];

  player.tower.pop();

  player.tower.unshift(
    newWallCard,
  );

  return createWallState(
    newWallCard,
  );
}