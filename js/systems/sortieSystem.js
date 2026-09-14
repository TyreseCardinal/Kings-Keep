import {
  PHASES,
  getCombatPhase,
  getLastStandPlayer,
} from "./phaseSystem.js";

import {
  moveCardById,
} from "./cardLifecycleSystem.js";

import {
  createWallState,
} from "./wallSystem.js";

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

export function getSortieProgress(
  sortieState,
) {
  if (!sortieState) {
    return 0;
  }

  return sortieState.cards.length;
}

export function isSortieComplete(
  sortieState,
) {
  return (
    getSortieProgress(sortieState) === 3
  );
}

export function recordSortieWin(
  sortieState,
  player,
  card,
) {
  if (
    !sortieState ||
    !sortieState.active
  ) {
    return false;
  }

  if (
    sortieState.eligiblePlayer !== player
  ) {
    return false;
  }

  if (
    !card ||
    card.type !== "number"
  ) {
    return false;
  }

  if (isSortieComplete(sortieState)) {
    return false;
  }

  const cardInCenterLane =
    player.siege.center.find(
      (siegeCard) =>
        siegeCard.id === card.id,
    );

  if (!cardInCenterLane) {
    return false;
  }

  moveCardById(
    player.siege.center,
    sortieState.cards,
    card.id,
  );

  return true;
}

export function preserveSortieOnTie(
  sortieState,
) {
  if (
    !sortieState ||
    !sortieState.active
  ) {
    return false;
  }

  return true;
}

export function resetSortieProgress(
  sortieState,
  deadPile,
) {
  if (
    !sortieState ||
    !sortieState.active ||
    !Array.isArray(deadPile)
  ) {
    return false;
  }

  while (sortieState.cards.length > 0) {
    const card =
      sortieState.cards[0];

    moveCardById(
      sortieState.cards,
      deadPile,
      card.id,
    );
  }

  return true;
}

export function rebuildWallsFromSortie(
  sortieState,
  player,
) {
  if (
    !sortieState ||
    !sortieState.active
  ) {
    return false;
  }

  if (
    sortieState.eligiblePlayer !== player
  ) {
    return false;
  }

  if (!isSortieComplete(sortieState)) {
    return false;
  }

  const rebuiltWalls = [
    ...sortieState.cards,
  ].reverse();

player.tower.unshift(
  ...rebuiltWalls,
);

player.activeWallState =
  createWallState(
    player.tower[0],
  );

sortieState.cards.length = 0;
sortieState.active = false;

  return true;
}

export function cancelSortie(
  sortieState,
  deadPile,
) {
  if (
    !sortieState ||
    !sortieState.active ||
    !Array.isArray(deadPile)
  ) {
    return false;
  }

  while (sortieState.cards.length > 0) {
    const card =
      sortieState.cards[0];

    moveCardById(
      sortieState.cards,
      deadPile,
      card.id,
    );
  }

  sortieState.active = false;

  return true;
}