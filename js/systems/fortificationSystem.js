import {
  moveCardByIdToProperty,
  moveCardFromProperty,
} from "./cardLifecycleSystem.js";

export function canFortify(wall, card) {
  return wall.card.baseValue === card.baseValue && wall.fortification === null;
}

export function canConvert(wall, card) {
  return hasFortification(wall) && wall.card.baseValue === card.baseValue;
}

export function convertFortification(
  player,
  wall,
  card,
  deadPile,
) {
  if (!canConvert(wall, card)) {
    return;
  }

  const cardInHand = player.hand.find(
    (handCard) => handCard.id === card.id,
  );

  if (!cardInHand) {
    return;
  }

  const oldHpContribution =
    wall.fortification.hpContribution;

  destroyFortification(
    wall,
    deadPile,
  );

  wall.currentHp -= oldHpContribution;

  return fortifyWall(
    player,
    wall,
    card,
  );
}

export function fortifyWall(player, wall, card) {
  if (!canFortify(wall, card)) {
    return;
  }

  wall.fortification = {
    card: null,
    hpContribution: card.baseValue,
  };

  const movedCard = moveCardByIdToProperty(
    player.hand,
    wall.fortification,
    "card",
    card.id,
  );

  if (!movedCard) {
    wall.fortification = null;
    return;
  }

  wall.currentHp += wall.fortification.hpContribution;

  return movedCard;
}

export function hasFortification(wall) {
  return wall.fortification !== null;
}

export function destroyFortification(wall, deadPile) {
  if (hasFortification(wall)) {
    moveCardFromProperty(wall.fortification, "card", deadPile);

    wall.fortification = null;
  }
}
