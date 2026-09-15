import {
  isOriginalKingDefeated,
} from "./kingSystem.js";

export function isPlayerDefeated(player) {
  if (!player?.kingState) {
    return false;
  }

  return isOriginalKingDefeated(
    player.kingState,
  );
}

export function getWinner(
  playerA,
  playerB,
) {
  if (
    isPlayerDefeated(playerA)
  ) {
    return playerB;
  }

  if (
    isPlayerDefeated(playerB)
  ) {
    return playerA;
  }

  return null;
}