import {
  resolveSiegeLanes,
  getFinalSiegeDamage,
  canResolveSiegeSpecial,
} from "./siegeSystem.js";

import {
  applyWallDamage,
  isWallDestroyed,
} from "./wallSystem.js";

import {
  advanceTower,
  getActiveDefense,
} from "./towerSystem.js";

import {
  resolveAceEffect,
} from "./specialCards/ace/aceSystem.js";

import {
  resolveDisruptionJackFortification,
} from "./specialCards/jack/jackSystem.js";

import {
  applyKingDamage,
  isKingLayerDestroyed,
  destroyKingReinforcement,
  isOriginalKingDefeated,
} from "./kingSystem.js";

import {
  PHASES,
  getCombatPhase,
  getLastStandPlayer,
} from "./phaseSystem.js";

import {
  isSortieComplete,
  recordSortieWin,
  preserveSortieOnTie,
  resetSortieProgress,
  rebuildWallsFromSortie,
  cancelSortie,
} from "./sortieSystem.js";

export function resolveLastStandSortieResult(
  sortieState,
  player,
  siegeResults,
  playerResult,
  deadPile,
) {
  if (
    !sortieState ||
    !sortieState.active ||
    !siegeResults
  ) {
    return false;
  }

  const centerResult =
    siegeResults.center;

  if (centerResult === "tie") {
    return preserveSortieOnTie(
      sortieState,
    );
  }

  if (centerResult !== playerResult) {
    return resetSortieProgress(
      sortieState,
      deadPile,
    );
  }

  const winningCard =
    player.siege.center.find(
      (card) =>
        card.type === "number",
    );

  if (!winningCard) {
    return false;
  }

  const winRecorded =
    recordSortieWin(
      sortieState,
      player,
      winningCard,
    );

  if (!winRecorded) {
    return false;
  }

  if (isSortieComplete(sortieState)) {
    return rebuildWallsFromSortie(
      sortieState,
      player,
    );
  }

  return true;
}

export function resolveSiegeAgainstKing(
  player,
  opponent,
  deadPile,
  removedFromGamePile,
  playerResult,
) {
  if (!opponent?.kingState) {
    return;
  }

  const siegeResults =
    resolveSiegeLanes(
      player,
      opponent,
    );

  const activeDefense =
    getActiveDefense(player);

  const finalDamage =
    getFinalSiegeDamage(
      player,
      opponent,
      siegeResults,
      playerResult,
      activeDefense,
    );

  const damagedKingLayer =
    applyKingDamage(
      opponent.kingState,
      finalDamage,
    );

  if (!damagedKingLayer) {
    return;
  }

  let reinforcementDestroyed = false;

  if (
    isKingLayerDestroyed(
      damagedKingLayer,
    ) &&
    damagedKingLayer !==
      opponent.kingState
  ) {
    reinforcementDestroyed =
      destroyKingReinforcement(
        opponent.kingState,
        removedFromGamePile,
      );
  }

  const originalKingDefeated =
    isOriginalKingDefeated(
      opponent.kingState,
    );

  return {
    siegeResults,
    finalDamage,
    damagedKingLayer,
    reinforcementDestroyed,
    originalKingDefeated,
  };
}

export function resolveEndgameSiege(
  playerA,
  playerB,
  removedFromGamePile,
) {
  const phase =
    getCombatPhase(
      playerA,
      playerB,
    );

  if (phase !== PHASES.ENDGAME) {
    return;
  }

  const siegeResults =
    resolveSiegeLanes(
      playerA,
      playerB,
    );

  const centerResult =
    siegeResults.center;

  if (centerResult === "tie") {
    return {
      siegeResults,
      centerResult,
      winner: null,
      loser: null,
      damageResult: null,
    };
  }

  let winner;
  let loser;
  let winnerResult;

  if (centerResult === "playerA") {
    winner = playerA;
    loser = playerB;
    winnerResult = "playerA";
  } else if (
    centerResult === "playerB"
  ) {
    winner = playerB;
    loser = playerA;
    winnerResult = "playerB";
  } else {
    return;
  }

  const activeDefense =
    getActiveDefense(winner);

  const finalDamage =
    getFinalSiegeDamage(
      winner,
      loser,
      siegeResults,
      winnerResult,
      activeDefense,
    );

  const damagedKingLayer =
    applyKingDamage(
      loser.kingState,
      finalDamage,
    );

  if (!damagedKingLayer) {
    return;
  }

  let reinforcementDestroyed = false;

  if (
    isKingLayerDestroyed(
      damagedKingLayer,
    ) &&
    damagedKingLayer !==
      loser.kingState
  ) {
    reinforcementDestroyed =
      destroyKingReinforcement(
        loser.kingState,
        removedFromGamePile,
      );
  }

  const originalKingDefeated =
    isOriginalKingDefeated(
      loser.kingState,
    );

  const damageResult = {
    finalDamage,
    damagedKingLayer,
    reinforcementDestroyed,
    originalKingDefeated,
  };

  return {
    siegeResults,
    centerResult,
    winner,
    loser,
    damageResult,
  };
}

export function resolveLastStandSiege(
  playerA,
  playerB,
  sortieState,
  deadPile,
  removedFromGamePile,
) {
  const phaseBeforeResolution =
    getCombatPhase(
      playerA,
      playerB,
    );

  if (
    phaseBeforeResolution !==
    PHASES.LAST_STAND
  ) {
    return;
  }

  const lastStandPlayer =
    getLastStandPlayer(
      playerA,
      playerB,
    );

  if (!lastStandPlayer) {
    return;
  }

  const wallPlayer =
    lastStandPlayer === playerA
      ? playerB
      : playerA;

  const lastStandResult =
    lastStandPlayer === playerA
      ? "playerA"
      : "playerB";

  const wallPlayerResult =
    wallPlayer === playerA
      ? "playerA"
      : "playerB";

  // ---------------------------------------------
  // SNAPSHOT THE SIEGE BEFORE SORTIE MUTATION
  // ---------------------------------------------

  const siegeResults =
    resolveSiegeLanes(
      playerA,
      playerB,
    );

  const centerResult =
    siegeResults.center;

  // Suit Repetition for this Siege must use
  // the Active Defense that existed when this
  // Siege began resolving.
  const lastStandActiveDefense =
    getActiveDefense(
      lastStandPlayer,
    );

  const wallPlayerActiveDefense =
    getActiveDefense(
      wallPlayer,
    );

  // Calculate both possible damage values before
  // Sortie processing can move the winning card
  // out of the Center lane.
  const lastStandDamage =
    getFinalSiegeDamage(
      lastStandPlayer,
      wallPlayer,
      siegeResults,
      lastStandResult,
      lastStandActiveDefense,
    );

  const wallPlayerDamage =
    getFinalSiegeDamage(
      wallPlayer,
      lastStandPlayer,
      siegeResults,
      wallPlayerResult,
      wallPlayerActiveDefense,
    );

  // ---------------------------------------------
  // SORTIE RESOLVES BEFORE DAMAGE
  // ---------------------------------------------

  if (
    sortieState?.active &&
    sortieState.eligiblePlayer ===
      lastStandPlayer
  ) {
    resolveLastStandSortieResult(
      sortieState,
      lastStandPlayer,
      siegeResults,
      lastStandResult,
      deadPile,
    );
  }

  // ---------------------------------------------
  // DAMAGE
  // ---------------------------------------------

  let damageResult;

  if (centerResult === lastStandResult) {
    const opponentWallState =
      wallPlayer.activeWallState;

    if (opponentWallState) {
      applyWallDamage(
        opponentWallState,
        lastStandDamage,
        deadPile,
      );

      let finalWallState =
        opponentWallState;

      if (
        isWallDestroyed(
          opponentWallState,
        )
      ) {
        finalWallState =
          advanceTower(
            wallPlayer,
            opponentWallState,
            deadPile,
          );
      }

      damageResult = {
        siegeResults,
        finalDamage:
          lastStandDamage,
        finalWallState,
      };
    }
  } else if (
    centerResult === wallPlayerResult
  ) {
    const damagedKingLayer =
      applyKingDamage(
        lastStandPlayer.kingState,
        wallPlayerDamage,
      );

    let reinforcementDestroyed = false;

    if (
      damagedKingLayer &&
      isKingLayerDestroyed(
        damagedKingLayer,
      ) &&
      damagedKingLayer !==
        lastStandPlayer.kingState
    ) {
      reinforcementDestroyed =
        destroyKingReinforcement(
          lastStandPlayer.kingState,
          removedFromGamePile,
        );
    }

    const originalKingDefeated =
      isOriginalKingDefeated(
        lastStandPlayer.kingState,
      );

    damageResult = {
      siegeResults,
      finalDamage:
        wallPlayerDamage,
      damagedKingLayer,
      reinforcementDestroyed,
      originalKingDefeated,
    };
  }

  // ---------------------------------------------
  // DETERMINE RESULTING PHASE
  // ---------------------------------------------

  const phaseAfterResolution =
    getCombatPhase(
      playerA,
      playerB,
    );

  if (
    phaseAfterResolution ===
      PHASES.ENDGAME &&
    sortieState?.active
  ) {
    cancelSortie(
      sortieState,
      deadPile,
    );
  }

  return {
    siegeResults,
    centerResult,
    lastStandPlayer,
    wallPlayer,
    damageResult,
    phaseBeforeResolution,
    phaseAfterResolution,
  };
}

// ---------------------------------------------
// NORMAL SIEGE RESOLUTION
// ---------------------------------------------

export function resolveNormalSiege(
  playerA,
  playerB,
  deadPile,
) {
  const phaseBeforeResolution =
    getCombatPhase(
      playerA,
      playerB,
    );

  if (
    phaseBeforeResolution !==
    PHASES.NORMAL_SIEGE
  ) {
    return;
  }

  // ---------------------------------------------
  // SNAPSHOT SIEGE
  // ---------------------------------------------

  const siegeResults =
    resolveSiegeLanes(
      playerA,
      playerB,
    );

  // ---------------------------------------------
  // SNAPSHOT ACTIVE WALLS
  // ---------------------------------------------

  const playerAWall =
    playerA.activeWallState;

  const playerBWall =
    playerB.activeWallState;

    // ---------------------------------------------
// SNAPSHOT ACTIVE DEFENSES
// ---------------------------------------------

const playerAActiveDefense =
  getActiveDefense(
    playerA,
  );

const playerBActiveDefense =
  getActiveDefense(
    playerB,
  );

  if (
    !playerAWall ||
    !playerBWall
  ) {
    return;
  }

  // ---------------------------------------------
  // RESOLVE PLAYER A → PLAYER B
  // ---------------------------------------------

 const playerAResult =
  resolveSiegeAgainstWall(
    playerA,
    playerB,
    playerBWall,
    deadPile,
    "playerA",
    siegeResults,
    playerAActiveDefense,
  );

  // ---------------------------------------------
  // RESOLVE PLAYER B → PLAYER A
  // ---------------------------------------------

 const playerBResult =
  resolveSiegeAgainstWall(
    playerB,
    playerA,
    playerAWall,
    deadPile,
    "playerB",
    siegeResults,
    playerBActiveDefense,
  );

  // ---------------------------------------------
  // DETERMINE RESULTING PHASE
  // ---------------------------------------------

  const phaseAfterResolution =
    getCombatPhase(
      playerA,
      playerB,
    );

  return {
    siegeResults,

    playerAResult,
    playerBResult,

    phaseBeforeResolution,
    phaseAfterResolution,
  };
}

export function resolveSiegeAgainstWall(
  player,
  opponent,
  opponentWall,
  deadPile,
  playerResult,
  existingSiegeResults = null,
  existingActiveDefense = null,
) {
  const siegeResults =
    existingSiegeResults ??
    resolveSiegeLanes(
      player,
      opponent,
    );

 const activeDefense =
  existingActiveDefense ??
  getActiveDefense(player);

  const finalDamage =
    getFinalSiegeDamage(
      player,
      opponent,
      siegeResults,
      playerResult,
      activeDefense,
    );

  const aceWallState =
    resolveAceEffect(
      player,
      opponent,
      siegeResults,
      playerResult,
      opponentWall,
      deadPile,
    );

  let damageTargetWall =
    opponentWall;

  if (aceWallState !== false) {
    if (aceWallState === undefined) {
      return {
        siegeResults,
        finalDamage,
        finalWallState: undefined,
      };
    }

    damageTargetWall =
      aceWallState;
  }

  const specialCanResolve =
    canResolveSiegeSpecial(
      player,
      opponent,
      siegeResults,
      playerResult,
    );

  resolveDisruptionJackFortification(
    player.siege.specialState,
    specialCanResolve,
    damageTargetWall,
    deadPile,
  );

  applyWallDamage(
    damageTargetWall,
    finalDamage,
    deadPile,
  );

  let finalWallState =
    damageTargetWall;

  if (
    isWallDestroyed(
      damageTargetWall,
    )
  ) {
    const advancedWallState =
      advanceTower(
        opponent,
        damageTargetWall,
        deadPile,
      );

    finalWallState =
      advancedWallState;
  }

  return {
    siegeResults,
    finalDamage,
    finalWallState,
  };
}