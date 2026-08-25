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