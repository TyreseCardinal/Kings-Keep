import { moveCard } from "./cardLifecycleSystem.js";

export function createPlayer(id) {
  const player = {
    id: id,
    hand: [],
    specialHand: [],
    tower: [],
  };

  return player;
}

export function drawCard(player, drawPile) {
  if (drawPile.length === 0) {
    return;
  }

  const drawnCard = drawPile[0];

  if (drawnCard.type === "number") {
    moveCard(drawPile, player.hand);
  } else if (
    drawnCard.type === "special" &&
    player.specialHand.length < 3
  ) {
    moveCard(drawPile, player.specialHand);
  } else {
    moveCard(drawPile, drawPile);
  }
}

export function drawStartingHand(player, drawPile) {
  while (player.hand.length !== 5 && drawPile.length !== 0) {
    drawCard(player, drawPile);
  }
}