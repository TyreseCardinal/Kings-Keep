import { SUITS, RANKS, SPECIAL_RANKS, CARD_TYPES } from "../data/cardData.js";
import { createCard } from "./cardSystem.js";

// Create Initial Game Deck (52 cards + 2 Jokers)
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
      continue;
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

// Create Tower Creation Deck and Special Reserves Deck //
export function createTowerCreationDeck(deck) {
  const towerCreationDeck = [];
  const specialReserve = [];

  for (const card of deck) {
    if (card.type === CARD_TYPES.NUMBER) {
      towerCreationDeck.push(card);
    } else if (card.type === CARD_TYPES.SPECIAL) {
      specialReserve.push(card);
    }
  }
  
  return {
    towerCreationDeck,
    specialReserve
  };
}

// Fisher-Yates Shuffle Function
export function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    const temp = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = temp;
  }

  return deck;
}

// Deal Tower Cards Function //
export function dealTowerCards(towerCreationDeck){
  const playerATower = [];
  const playerBTower = [];

  for (let i = 0; i < 7; i++) {
    if (towerCreationDeck.length < 2) {
      console.log("Error: No cards detected in towerCreationDeck");
      break;
    }

      playerATower.push(towerCreationDeck.shift());
      playerBTower.push(towerCreationDeck.shift());
  }

  return {
    playerATower,
    playerBTower
  };
}

// Deal 1 King each to both Player's Towers //
export function dealStartingKings(specialReserve) {
  
  // Find the first card with the rank of King in specialReserve deck
  const firstKingIndex = specialReserve.findIndex(card => card.rank === "king");
  const firstRemovedKing = specialReserve.splice(firstKingIndex, 1);
  const playerAKing = firstRemovedKing[0];

  // Find the next card with the rank of King in specialReserve deck
  const secondKingIndex = specialReserve.findIndex(card => card.rank === "king");
  const secondRemovedKing = specialReserve.splice(secondKingIndex, 1);
  const playerBKing = secondRemovedKing[0];



  return {
    playerAKing,
    playerBKing
  };
}

// Combine remaining cards in towerCreationDeck and specialReserve into drawPile 
export function createDrawPile(towerCreationDeck, specialReserve) {
  const drawPile = [];

  // Move remaining tower cards into drawPile
  while (towerCreationDeck.length > 0) {
    drawPile.push(towerCreationDeck.shift());
  }

  // Move remaining special cards into drawPile
  while (specialReserve.length > 0) {
    drawPile.push(specialReserve.shift());
  }
  // Shuffle drawPile
  shuffleDeck(drawPile);

  return drawPile;
}