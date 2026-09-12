import { moveCard } from "./cardLifecycleSystem.js";

import { createSiege } from "./siegeSystem.js";

import {
  isKing,
  canReinforceKing,
  reinforceKing,
} from "./kingSystem.js";

import {
  PHASES,
} from "./phaseSystem.js";

export function createPlayer(id) {
  const player = {
    id: id,
    hand: [],
    specialHand: [],
    tower: [],
    siege: createSiege(),
    kingState: null,
  };

  return player;
}

export function drawCard(
  player,
  drawPile,
  phase = PHASES.NORMAL_SIEGE,
  deadPile = null,
) {
  if (drawPile.length === 0) {
    return;
  }

  const drawnCard = drawPile[0];

  // ---------------------------------------------
  // Number Card
  // ---------------------------------------------

  if (drawnCard.type === "number") {
    moveCard(
      drawPile,
      player.hand,
    );

    return;
  }

  // ---------------------------------------------
  // Last Stand / Endgame Special Draw
  // ---------------------------------------------

  if (
    phase === PHASES.LAST_STAND ||
    phase === PHASES.ENDGAME
  ) {
    if (!Array.isArray(deadPile)) {
      return;
    }

    moveCard(
      drawPile,
      deadPile,
    );

    return;
  }

  // ---------------------------------------------
  // Normal Siege King Reinforcement
  // ---------------------------------------------

  if (
    isKing(drawnCard) &&
    player.kingState !== null &&
    canReinforceKing(
      player.kingState,
      drawnCard,
    )
  ) {
    moveCard(
      drawPile,
      player.specialHand,
    );

    const kingCard =
      player.specialHand[
        player.specialHand.length - 1
      ];

    reinforceKing(
      player.kingState,
      kingCard,
    );

    player.specialHand.pop();

    return;
  }

  // ---------------------------------------------
  // Rejected King
  // ---------------------------------------------

  if (isKing(drawnCard)) {
    moveCard(
      drawPile,
      drawPile,
    );

    return;
  }

  // ---------------------------------------------
  // Normal Siege Special Hand
  // ---------------------------------------------

  if (
    drawnCard.type === "special" &&
    player.specialHand.length < 3
  ) {
    moveCard(
      drawPile,
      player.specialHand,
    );

    return;
  }

  // ---------------------------------------------
  // Full Special Hand
  // ---------------------------------------------

  moveCard(
    drawPile,
    drawPile,
  );
}

export function drawStartingHand(
  player,
  drawPile,
) {
  while (
    player.hand.length !== 5 &&
    drawPile.length !== 0
  ) {
    drawCard(
      player,
      drawPile,
    );
  }
}