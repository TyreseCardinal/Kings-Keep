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

  for (const specialRank of SPECIAL_RANKS) {
    if (specialRank === "joker") {
      continue
    }

    for (const suit of SUITS) {
      const specialCard = createCard(suit, specialRank);
      deck.push(specialCard);
    }
  }

  const jokerOne = createCard(null, "joker", 1);
  const jokerTwo = createCard(null, "joker", 2);

  deck.push(jokerOne, jokerTwo);

  return deck;
}