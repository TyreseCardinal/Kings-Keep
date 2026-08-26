import {
  createWallState,
  destroyWall,
  isWallDestroyed,
} from "./wallSystem.js";

export function getActiveWall(player) {
  return player.tower[0];
}

export function getHiddenWalls(player) {
  const hiddenWalls = player.tower.slice(1, player.tower.length - 1);

  return hiddenWalls;
}

export function getKing(player) {
  return player.tower[player.tower.length - 1];
}

export function isKingActive(player) {
  return player.tower[0].rank === "king";
}

export function advanceTower(player, wall, deadPile) {
  if (!isWallDestroyed(wall)) {
    return;
  }

  destroyWall(player, wall, deadPile);

  if (isKingActive(player)) {
    return;
  }

  const newActiveWall = getActiveWall(player);

  const newWallState = createWallState(newActiveWall);

  return newWallState;
}