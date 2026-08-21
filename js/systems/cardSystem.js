import { RANKS, SUITS, SPECIAL_RANKS, CARD_TYPES } from "../data/cardData.js";

class Card {
  constructor(id, suit, rank, type, baseValue, siegeValue) {
    this.id = id;
    this.suit = suit;
    this.rank = rank;
    this.type = type;
    this.baseValue = baseValue;
    this.siegeValue = siegeValue;
  }
}

export function createCard(suit, rank, jokerIndex = null) {
  const isNumberRank = RANKS.includes(rank);
  const isSpecialRank = SPECIAL_RANKS.includes(rank);

  if (!isNumberRank && !isSpecialRank) {
    throw new Error(`Invalid card rank: ${rank}`);
  }

  if (rank !== "joker" && !SUITS.includes(suit)) {
    throw new Error(`Invalid card suit: ${suit}`);
  }

  if (rank === "joker" && suit !== null) {
    throw new Error("Joker must have no printed suit.");
  }

  if (rank === "joker" && jokerIndex === null) {
    throw new Error("Joker requires a unique index.");
  }
  
  let type;

  if (isNumberRank) {
    type = CARD_TYPES.NUMBER;
  } else if (isSpecialRank) {
    type = CARD_TYPES.SPECIAL;
  }

  let baseValue = 0;
  let siegeValue = 0;

  if (type === CARD_TYPES.NUMBER) {
    const faceValue = Number(rank);
    baseValue = faceValue;
    siegeValue = faceValue;
  } else {
    baseValue = 0;
    siegeValue = 0;
  }

  let id = "";

  if (rank === "joker") {
    id = `joker-${jokerIndex}`;
  } else {
    id = `${rank}-${suit}`;
  }

  return new Card(id, suit, rank, type, baseValue, siegeValue);
}
