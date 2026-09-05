import { isSiegeSpecialCard } from "../../specialCardSystem.js";

export function isQueen(card) {
  return isSiegeSpecialCard(card) && card.rank === "queen";
}

const VALID_QUEEN_SUITS = ["hearts", "diamonds", "clubs", "spades"];

export function isValidQueenSuit(suit) {
  return VALID_QUEEN_SUITS.includes(suit);
}

export function createQueenState(card, declaredSuit) {
  if (!isQueen(card)) {
    return;
  }

  if (!isValidQueenSuit(declaredSuit)) {
    return;
  }

  return {
    card,
    declaredSuit,
  };
}
