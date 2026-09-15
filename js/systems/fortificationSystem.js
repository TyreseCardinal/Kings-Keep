import {
  moveCardByIdToProperty,
  moveCardFromProperty,
} from "./cardLifecycleSystem.js";

import {
  PHASES,
} from "./phaseSystem.js";

export function canFortify(
  wall,
  card,
  phase = PHASES.NORMAL_SIEGE,
) {
  if (
    phase === PHASES.LAST_STAND ||
    phase === PHASES.ENDGAME
  ) {
    return false;
  }

  if (!wall || !card) {
    return false;
  }

  return (
    wall.card.baseValue === card.baseValue &&
    wall.fortification === null
  );
}

export function fortifyWall(
  player,
  wall,
  card,
  phase = PHASES.NORMAL_SIEGE,
) {
  if (
    !player ||
    player.activeWallState !== wall
  ) {
    return;
  }

  if (
    !canFortify(
      wall,
      card,
      phase,
    )
  ) {
    return;
  }

  wall.fortification = {
    card: null,
    hpContribution: card.baseValue,
  };

  const movedCard =
    moveCardByIdToProperty(
      player.hand,
      wall.fortification,
      "card",
      card.id,
    );

  if (!movedCard) {
    wall.fortification = null;
    return;
  }

  wall.currentHp +=
    wall.fortification.hpContribution;

  return movedCard;
}

export function hasFortification(wall) {
  return wall.fortification !== null;
}

export function destroyFortification(
  wall,
  deadPile,
) {
  if (hasFortification(wall)) {
    moveCardFromProperty(
      wall.fortification,
      "card",
      deadPile,
    );

    wall.fortification = null;
  }
}

export function removeFortificationHp(
  wall,
  deadPile,
) {
  if (!hasFortification(wall)) {
    return false;
  }

  wall.currentHp = Math.min(
    wall.currentHp,
    wall.baseHp,
  );

  destroyFortification(
    wall,
    deadPile,
  );

  return true;
}