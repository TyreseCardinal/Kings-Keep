import { SUITS, RANKS, SPECIAL_RANKS } from "../data/cardData.js";
import { createCard } from "./cardSystem.js";

export function createDeck() {
  const deck = [];

  for (const rank of RANKS) {
    for (const suit of SUITS) {
      const card = createCard(suit, rank);
      deck.push(card);
    }
  }

  return deck;
}

