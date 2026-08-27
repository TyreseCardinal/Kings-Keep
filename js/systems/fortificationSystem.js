import {
  moveCardByIdToProperty,
} from "./cardLifecycleSystem.js";

export function canFortify(wall, card) {
  return (
    wall.card.baseValue === card.baseValue &&
    wall.fortification === null
  );
}

export function fortifyWall(player, wall, card) {
  if (!canFortify(wall, card)) {
    return;
  }

  wall.fortification = {
    card: null,
    hpContribution: card.baseValue,
  };

  moveCardByIdToProperty(
  player.hand,
  wall.fortification,
  "card",
  card.id,
);

  wall.currentHp += wall.fortification.hpContribution;
}