import {
  moveCard,
  recycleDeadPile,
} from "./cardLifecycleSystem.js";

import { shuffleDeck } from "./deckSystem.js";

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
    activeWallState: null,
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
  // King Reinforcement
  // Kings reinforce during ANY combat phase.
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

  if (!Array.isArray(deadPile)) {
    return;
  }

  moveCard(
    drawPile,
    deadPile,
  );

  return;
}

export function refillNumberHand(
  player,
  drawPile,
  deadPile,
  phase = PHASES.NORMAL_SIEGE,
) {
  const cardsSeenWithoutNumber =
    new Set();

  while (player.hand.length < 5) {
    // ---------------------------------------------
    // Recycle Dead Pile If Draw Pile Is Empty
    // ---------------------------------------------

    if (drawPile.length === 0) {
      recycleDeadPile(
        drawPile,
        deadPile,
        shuffleDeck,
      );
    }

    // ---------------------------------------------
    // No Cards Available
    // ---------------------------------------------

    if (drawPile.length === 0) {
      return;
    }

    // ---------------------------------------------
    // Track Next Card
    // ---------------------------------------------

    const nextCard =
      drawPile[0];

    const handSizeBefore =
      player.hand.length;

    const drawPileSizeBefore =
      drawPile.length;

    // ---------------------------------------------
    // Stop If Card Cycle Repeats
    // ---------------------------------------------

    if (
      cardsSeenWithoutNumber.has(
        nextCard.id,
      )
    ) {
      return;
    }

    // ---------------------------------------------
    // Draw Next Card
    // ---------------------------------------------

    drawCard(
      player,
      drawPile,
      phase,
      deadPile,
    );

    // ---------------------------------------------
    // Draw Failed
    // ---------------------------------------------

    if (
      drawPile.length ===
      drawPileSizeBefore
    ) {
      return;
    }

    // ---------------------------------------------
    // Number Was Drawn
    // ---------------------------------------------

    if (
      player.hand.length >
      handSizeBefore
    ) {
      cardsSeenWithoutNumber.clear();

      continue;
    }

    // ---------------------------------------------
    // Non-Number Was Drawn
    // ---------------------------------------------

    cardsSeenWithoutNumber.add(
      nextCard.id,
    );
  }
}

export function drawStartingHand(
  player,
  drawPile,
  deadPile,
) {
  refillNumberHand(
    player,
    drawPile,
    deadPile,
    PHASES.NORMAL_SIEGE,
  );
}