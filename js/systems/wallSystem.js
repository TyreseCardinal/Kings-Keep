import { moveCardById } from "./cardLifecycleSystem.js";

import {
  destroyFortification,
  hasFortification,
} from "./fortificationSystem.js";

export function createWallState(card) {
  const wall = {
    card: card,
    baseHp: card.baseValue,
    currentHp: card.baseValue,
    fortification: null,
  };

  return wall;
}

export function applyWallDamage(
  wall,
  amount,
  deadPile = null,
) {
  wall.currentHp -= amount;

  if (wall.currentHp < 0) {
    wall.currentHp = 0;
  }

  if (
    deadPile !== null &&
    hasFortification(wall) &&
    wall.currentHp <= wall.baseHp
  ) {
    destroyFortification(
      wall,
      deadPile,
    );
  }
}

export function isWallDestroyed(wall) {
  return wall.currentHp === 0;
}

export function destroyWall(player, wall, deadPile) {
  if (!isWallDestroyed(wall)) {
    return;
  }

  destroyFortification(
    wall,
    deadPile,
  );

  moveCardById(
    player.tower,
    deadPile,
    wall.card.id,
  );
}