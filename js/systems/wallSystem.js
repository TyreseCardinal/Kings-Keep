import { moveCardById } from "./cardLifecycleSystem.js";

export function createWallState(card) {
  const wall = {
    card: card,
    baseHp: card.baseValue,
    currentHp: card.baseValue,
  };

  return wall;
}

export function applyWallDamage(wall, amount) {
  wall.currentHp -= amount;

  if (wall.currentHp < 0) {
    wall.currentHp = 0;
  }
}

export function isWallDestroyed(wall) {
  return wall.currentHp === 0;
}

export function destroyWall(player, wall, deadPile) {
  if (!isWallDestroyed(wall)) {
    return;
  }

  moveCardById(player.tower, deadPile, wall.card.id); 
}