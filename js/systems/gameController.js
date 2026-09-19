import {
  PHASES,
  getCombatPhase,
  getLastStandPlayer,
} from "./phaseSystem.js";

import {
  createSortieState,
  cancelSortie,
} from "./sortieSystem.js";

import {
  resolveNormalSiege,
  resolveLastStandSiege,
  resolveEndgameSiege,
} from "./siegeResolutionSystem.js";

import {
  clearSiege,
  playSiegeCard,
  canPlayToSiege,
} from "./siegeSystem.js";

import {
  refillNumberHand,
} from "./playerSystem.js";

import {
  fortifyWall,
} from "./fortificationSystem.js";

import {
  convertWall,
} from "./convertSystem.js";

import {
  getWinner,
} from "./victorySystem.js";

import {
  isJack,
  createJackState,
} from "./specialCards/jack/jackSystem.js";

import {
  isQueen,
  createQueenState,
} from "./specialCards/queen/queenSystem.js";

export const GAME_STATUS = {
  ACTIVE: "active",
  FINISHED: "finished",
};

export const SIEGE_STAGES = {
  SELECT_LEFT: "select_left",
  SELECT_CENTER: "select_center",
  SELECT_RIGHT: "select_right",
  REVEAL: "reveal",
  RESOLVE: "resolve",
};

export const LANE_DECISIONS = {
  FORFEIT: "forfeit",
};

// ---------------------------------------------
// CREATE GAME CONTROLLER
// ---------------------------------------------

export function createGameController(
  playerA,
  playerB,
  drawPile,
  deadPile,
) {
  if (
    !playerA ||
    !playerB ||
    !Array.isArray(drawPile) ||
    !Array.isArray(deadPile)
  ) {
    return;
  }

  const currentPhase =
    getCombatPhase(
      playerA,
      playerB,
    );

  const siegeStage =
    currentPhase ===
    PHASES.NORMAL_SIEGE
      ? SIEGE_STAGES.SELECT_LEFT
      : SIEGE_STAGES.SELECT_CENTER;

  return {
    playerA,
    playerB,

    drawPile,
    deadPile,

    removedFromGamePile: [],

    sortieState: null,

    currentPhase,

    siegeStage,

    pendingSelections: {
      playerA: null,
      playerB: null,
    },

    lockedSelections: {
  left: {
    playerA: null,
    playerB: null,
  },

  center: {
    playerA: null,
    playerB: null,
  },

  right: {
    playerA: null,
    playerB: null,
  },
},

    status: GAME_STATUS.ACTIVE,

    winner: null,
  };
}

// ---------------------------------------------
// GET PLAYER SELECTION KEY
// ---------------------------------------------

function getPlayerSelectionKey(
  game,
  player,
) {
  if (player === game.playerA) {
    return "playerA";
  }

  if (player === game.playerB) {
    return "playerB";
  }

  return;
}

// ---------------------------------------------
// FORFEIT CURRENT LANE
// ---------------------------------------------

export function forfeitCurrentLane(
  game,
  player,
) {
  if (
    !game ||
    !player ||
    game.status !==
      GAME_STATUS.ACTIVE
  ) {
    return;
  }

  const playerKey =
    getPlayerSelectionKey(
      game,
      player,
    );

  if (!playerKey) {
    return;
  }

  if (
    game.pendingSelections[
      playerKey
    ] !== null
  ) {
    return;
  }

  game.pendingSelections[
    playerKey
  ] = LANE_DECISIONS.FORFEIT;

  return LANE_DECISIONS.FORFEIT;
}

// ---------------------------------------------
// GET CURRENT SELECTION LANE
// ---------------------------------------------

function getCurrentSelectionLane(
  game,
) {
  if (
    game.siegeStage ===
    SIEGE_STAGES.SELECT_LEFT
  ) {
    return "left";
  }

  if (
    game.siegeStage ===
    SIEGE_STAGES.SELECT_CENTER
  ) {
    return "center";
  }

  if (
    game.siegeStage ===
    SIEGE_STAGES.SELECT_RIGHT
  ) {
    return "right";
  }

  return;
}

// ---------------------------------------------
// SELECT CARD FOR CURRENT LANE
// ---------------------------------------------

export function selectCardForCurrentLane(
  game,
  player,
  card,
  specialChoice = null,
) {
  if (
    !game ||
    !player ||
    !card ||
    game.status !== GAME_STATUS.ACTIVE
  ) {
    return;
  }

  const playerKey =
    getPlayerSelectionKey(
      game,
      player,
    );

  if (!playerKey) {
    return;
  }

  if (
    game.pendingSelections[
      playerKey
    ] !== null
  ) {
    return;
  }

  const ownsCard =
    player.hand.includes(card) ||
    player.specialHand.includes(card);

  if (!ownsCard) {
    return;
  }

  const lane =
    getCurrentSelectionLane(game);

  if (!lane) {
    return;
  }

  const currentPhase =
    syncCombatPhase(game);

  const canSelectCard =
    canPlayToSiege(
      player,
      card,
      lane,
      currentPhase,
    );

  if (!canSelectCard) {
    return;
  }

  let specialState = null;

  if (isJack(card)) {
    specialState =
      createJackState(
        card,
        specialChoice,
      );

    if (!specialState) {
      return;
    }
  }

  if (isQueen(card)) {
    specialState =
      createQueenState(
        card,
        specialChoice,
      );

    if (!specialState) {
      return;
    }
  }

  const selection = {
    card,
    specialState,
  };

  game.pendingSelections[
    playerKey
  ] = selection;

  return selection;
}

// ---------------------------------------------
// ARE CURRENT LANE DECISIONS LOCKED
// ---------------------------------------------

export function areCurrentLaneDecisionsLocked(
  game,
) {
  if (!game?.pendingSelections) {
    return false;
  }

  return (
    game.pendingSelections.playerA !== null &&
    game.pendingSelections.playerB !== null
  );
}

// ---------------------------------------------
// LOCK CURRENT LANE DECISIONS
// ---------------------------------------------

export function lockCurrentLaneDecisions(
  game,
) {
  if (
    !game ||
    game.status !== GAME_STATUS.ACTIVE ||
    !areCurrentLaneDecisionsLocked(game)
  ) {
    return;
  }

  const lane =
    getCurrentSelectionLane(game);

  if (!lane) {
    return;
  }

  game.lockedSelections[lane] = {
    playerA:
      game.pendingSelections.playerA,
    playerB:
      game.pendingSelections.playerB,
  };

  game.pendingSelections.playerA =
    null;

  game.pendingSelections.playerB =
    null;

  if (
    game.siegeStage ===
    SIEGE_STAGES.SELECT_LEFT
  ) {
    game.siegeStage =
      SIEGE_STAGES.SELECT_CENTER;
  } else if (
    game.siegeStage ===
    SIEGE_STAGES.SELECT_CENTER &&
    game.currentPhase ===
      PHASES.NORMAL_SIEGE
  ) {
    game.siegeStage =
      SIEGE_STAGES.SELECT_RIGHT;
  } else {
    game.siegeStage =
      SIEGE_STAGES.REVEAL;
  }

  return game.siegeStage;
}

// ---------------------------------------------
// SYNCHRONIZE COMBAT PHASE
// ---------------------------------------------

export function syncCombatPhase(
  game,
) {
  if (!game) {
    return;
  }

  const currentPhase =
    getCombatPhase(
      game.playerA,
      game.playerB,
    );

  game.currentPhase =
    currentPhase;

  return currentPhase;
}

// ---------------------------------------------
// SYNCHRONIZE SORTIE STATE
// ---------------------------------------------

export function syncSortieState(
  game,
) {
  if (!game) {
    return;
  }

  const currentPhase =
    syncCombatPhase(game);

  if (
    currentPhase ===
    PHASES.NORMAL_SIEGE
  ) {
    game.sortieState = null;
    return null;
  }

  if (
    currentPhase ===
    PHASES.ENDGAME
  ) {
    if (game.sortieState?.active) {
      cancelSortie(
        game.sortieState,
        game.deadPile,
      );
    }

    game.sortieState = null;

    return null;
  }

  const lastStandPlayer =
    getLastStandPlayer(
      game.playerA,
      game.playerB,
    );

  if (!lastStandPlayer) {
    return;
  }

  if (
    game.sortieState?.active &&
    game.sortieState.eligiblePlayer ===
      lastStandPlayer
  ) {
    return game.sortieState;
  }

  if (game.sortieState?.active) {
    cancelSortie(
      game.sortieState,
      game.deadPile,
    );
  }

  game.sortieState =
    createSortieState(
      lastStandPlayer,
      game.playerA,
      game.playerB,
    );

  return game.sortieState;
}

// ---------------------------------------------
// SYNCHRONIZE VICTORY STATE
// ---------------------------------------------

export function syncVictoryState(
  game,
) {
  if (!game) {
    return;
  }

  if (
    game.status ===
    GAME_STATUS.FINISHED
  ) {
    return game.winner;
  }

  const winner =
    getWinner(
      game.playerA,
      game.playerB,
    );

  if (!winner) {
    return null;
  }

  game.winner = winner;
  game.status =
    GAME_STATUS.FINISHED;

  return winner;
}

// ---------------------------------------------
// REFILL PLAYER NUMBER HAND
// ---------------------------------------------

export function refillPlayerHand(
  game,
  player,
) {
  if (
    !game ||
    !player ||
    game.status !==
      GAME_STATUS.ACTIVE
  ) {
    return;
  }

  const currentPhase =
    syncCombatPhase(game);

  refillNumberHand(
    player,
    game.drawPile,
    game.deadPile,
    currentPhase,
  );
}

// ---------------------------------------------
// PLAY CARD TO SIEGE
// ---------------------------------------------

export function playCardToSiege(
  game,
  player,
  card,
  lane,
) {
  if (
    !game ||
    !player ||
    !card ||
    game.status !==
      GAME_STATUS.ACTIVE
  ) {
    return;
  }

  const currentPhase =
    syncCombatPhase(game);

  const playedCard =
    playSiegeCard(
      player,
      card,
      lane,
      currentPhase,
    );

  if (!playedCard) {
    return;
  }

  if (card.type === "number") {
    refillPlayerHand(
      game,
      player,
    );
  }

  return playedCard;
}

// ---------------------------------------------
// FORTIFY ACTIVE WALL
// ---------------------------------------------

export function fortifyActiveWall(
  game,
  player,
  card,
) {
  if (
    !game ||
    !player ||
    !card ||
    game.status !==
      GAME_STATUS.ACTIVE
  ) {
    return;
  }

  const currentPhase =
    syncCombatPhase(game);

  const fortifiedCard =
    fortifyWall(
      player,
      player.activeWallState,
      card,
      currentPhase,
    );

  if (!fortifiedCard) {
    return;
  }

  refillPlayerHand(
    game,
    player,
  );

  return fortifiedCard;
}

// ---------------------------------------------
// CONVERT ACTIVE WALL
// ---------------------------------------------

export function convertActiveWall(
  game,
  player,
  card,
) {
  if (
    !game ||
    !player ||
    !card ||
    game.status !==
      GAME_STATUS.ACTIVE
  ) {
    return;
  }

  const currentPhase =
    syncCombatPhase(game);

  const convertedWallState =
    convertWall(
      player,
      player.activeWallState,
      card,
      game.deadPile,
      currentPhase,
    );

  if (!convertedWallState) {
    return;
  }

  refillPlayerHand(
    game,
    player,
  );

  return convertedWallState;
}

// ---------------------------------------------
// RESOLVE CURRENT SIEGE
// ---------------------------------------------

export function resolveCurrentSiege(
  game,
) {
  if (
    !game ||
    game.status !==
      GAME_STATUS.ACTIVE
  ) {
    return;
  }

  const currentPhase =
    syncCombatPhase(game);

  let siegeResult;

  if (
    currentPhase ===
    "normal_siege"
  ) {
    siegeResult =
      resolveNormalSiege(
        game.playerA,
        game.playerB,
        game.deadPile,
      );
  }

  if (
    currentPhase ===
    "last_stand"
  ) {
    siegeResult =
      resolveLastStandSiege(
        game.playerA,
        game.playerB,
        game.sortieState,
        game.deadPile,
        game.removedFromGamePile,
      );
  }

  if (
    currentPhase ===
    "endgame"
  ) {
    siegeResult =
      resolveEndgameSiege(
        game.playerA,
        game.playerB,
        game.removedFromGamePile,
      );
  }

  if (siegeResult === undefined) {
    return;
  }

  clearSiege(
    game.playerA,
    game.deadPile,
  );

  clearSiege(
    game.playerB,
    game.deadPile,
  );

  syncSortieState(game);

  syncVictoryState(game);

  return siegeResult;
}