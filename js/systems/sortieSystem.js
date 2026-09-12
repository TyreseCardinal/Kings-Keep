import {
  PHASES,
  getCombatPhase,
  getLastStandPlayer,
} from "./phaseSystem.js";

export function canStartSortie(
  player,
  playerA,
  playerB,
) {
  const phase = getCombatPhase(
    playerA,
    playerB,
  );

  if (phase !== PHASES.LAST_STAND) {
    return false;
  }

  const lastStandPlayer =
    getLastStandPlayer(
      playerA,
      playerB,
    );

  return lastStandPlayer === player;
}

export function createSortieState(
  player,
  playerA,
  playerB,
) {
  if (
    !canStartSortie(
      player,
      playerA,
      playerB,
    )
  ) {
    return;
  }

  return {
    eligiblePlayer: player,
    cards: [],
    active: true,
  };
}