export const PHASES = {
  NORMAL_SIEGE: "normal_siege",
  LAST_STAND: "last_stand",
  ENDGAME: "endgame",
};

export function createPhaseState() {
  return {
    currentPhase: PHASES.NORMAL_SIEGE,
  };
}

export function getCombatPhase(playerA, playerB) {
  const playerAHasWalls =
    playerA.tower.length > 1;

  const playerBHasWalls =
    playerB.tower.length > 1;

  if (playerAHasWalls && playerBHasWalls) {
    return PHASES.NORMAL_SIEGE;
  }

  if (!playerAHasWalls && !playerBHasWalls) {
    return PHASES.ENDGAME;
  }

  return PHASES.LAST_STAND;
}

export function getLastStandPlayer(
  playerA,
  playerB,
) {
  if (
    getCombatPhase(playerA, playerB) !==
    PHASES.LAST_STAND
  ) {
    return;
  }

  const playerAHasWalls =
    playerA.tower.length > 1;

  if (!playerAHasWalls) {
    return playerA;
  }

  return playerB;
}