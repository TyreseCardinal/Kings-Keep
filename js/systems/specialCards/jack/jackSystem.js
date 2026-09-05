import { canResolveSiegeSpecial } from "../../siegeSystem.js";

import { removeFortificationHp } from "../../fortificationSystem.js";

import { isSiegeSpecialCard } from "../../specialCardSystem.js";

export const JACK_MODES = {
  ATTACK: "attack",
  DISRUPTION: "disruption",
};

export function isJack(card) {
  return isSiegeSpecialCard(card) && card.rank === "jack";
}

export function isValidJackMode(mode) {
  return mode === JACK_MODES.ATTACK || mode === JACK_MODES.DISRUPTION;
}

export function createJackState(card, mode) {
  if (!isJack(card)) {
    return;
  }

  if (!isValidJackMode(mode)) {
    return;
  }

  return {
    card,
    mode,
  };
}

export function getJackAttackValue(jackState) {
  if (jackState?.mode === JACK_MODES.ATTACK) {
    return 11;
  }

  return 0;
}

export function isDisruptionJack(jackState) {
  return isJack(jackState?.card) && jackState.mode === JACK_MODES.DISRUPTION;
}

export function canResolveDisruptionJack(jackState, specialCanResolve) {
  if (!isDisruptionJack(jackState)) {
    return false;
  }

  return specialCanResolve === true;
}

export function resolveDisruptionJackFortification(
  jackState,
  specialCanResolve,
  opponentWall,
  deadPile,
) {
  if (!canResolveDisruptionJack(jackState, specialCanResolve)) {
    return false;
  }

  if (opponentWall?.fortification === null) {
    return false;
  }

  removeFortificationHp(opponentWall, deadPile);

  return true;
}
