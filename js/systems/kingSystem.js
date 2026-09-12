export const KING_HP = 15;

export function isKing(card) {
  return card?.type === "special" && card.rank === "king";
}

export function createKingState(card) {
  if (!isKing(card)) {
    return;
  }

  return {
    card,
    baseHp: KING_HP,
    currentHp: KING_HP,
    reinforcements: [],
  };
}

export function canReinforceKing(
  kingState,
  card,
) {
  if (!kingState || !isKing(card)) {
    return false;
  }

  return kingState.reinforcements.length < 2;
}

export function reinforceKing(
  kingState,
  card,
) {
  if (!canReinforceKing(kingState, card)) {
    return;
  }

  const reinforcement = {
    card,
    baseHp: KING_HP,
    currentHp: KING_HP,
  };

  kingState.reinforcements.push(
    reinforcement,
  );

  return reinforcement;
}

export function getExposedKingLayer(
  kingState,
) {
  if (!kingState) {
    return;
  }

  if (kingState.reinforcements.length > 0) {
    return kingState.reinforcements[
      kingState.reinforcements.length - 1
    ];
  }

  return kingState;
}

export function applyKingDamage(
  kingState,
  amount,
) {
  const exposedLayer =
    getExposedKingLayer(
      kingState,
    );

  if (!exposedLayer) {
    return;
  }

  exposedLayer.currentHp -= amount;

  if (exposedLayer.currentHp < 0) {
    exposedLayer.currentHp = 0;
  }

  return exposedLayer;
}

export function isKingLayerDestroyed(
  kingLayer,
) {
  return (
    kingLayer?.currentHp === 0
  );
}

export function destroyKingReinforcement(
  kingState,
  removedFromGamePile,
) {
  if (
    !kingState ||
    kingState.reinforcements.length === 0
  ) {
    return false;
  }

  const reinforcement =
    getExposedKingLayer(
      kingState,
    );

  if (
    !isKingLayerDestroyed(
      reinforcement,
    )
  ) {
    return false;
  }

  kingState.reinforcements.pop();

  removedFromGamePile.push(
    reinforcement.card,
  );

  return true;
}

export function isOriginalKingDefeated(
  kingState,
) {
  if (!kingState) {
    return false;
  }

  return (
    kingState.reinforcements.length === 0 &&
    isKingLayerDestroyed(kingState)
  );
}