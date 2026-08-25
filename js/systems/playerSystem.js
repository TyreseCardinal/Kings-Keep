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
  } else if (drawnCard.type === "special") {
    moveCard(drawPile, player.specialHand);
  }
}
