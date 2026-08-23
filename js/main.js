import {
  createDeck,
  createTowerCreationDeck,
  shuffleDeck,
  dealTowerCards,
  dealStartingKings,
  createDrawPile,
} from "./systems/deckSystem.js";

import {
  moveCard,
  moveCardAtIndex,
  moveCardById,
  moveCards,
} from "./systems/cardLifecycleSystem.js";

const deck = createDeck();

const { towerCreationDeck, specialReserve } =
  createTowerCreationDeck(deck);

shuffleDeck(towerCreationDeck);

const { playerATower, playerBTower } =
  dealTowerCards(towerCreationDeck);

const { playerAKing, playerBKing } =
  dealStartingKings(specialReserve);

const drawPile =
  createDrawPile(towerCreationDeck, specialReserve);

playerATower.push(playerAKing);
playerBTower.push(playerBKing);


// ------------------------------
// TEST: moveCardById()
// ------------------------------

const testHand = [];

const targetCardId = drawPile[5].id;

const movedCard = moveCardById(
  drawPile,
  testHand,
  targetCardId
);

console.log("Target ID:", targetCardId);
console.log("Moved Card:", movedCard);
console.log("Hand:", testHand);
console.log("Draw Pile Length:", drawPile.length);


// ------------------------------
// TEST: moveCards()
// ------------------------------

const testSource = ["A", "B", "C", "D", "E"];
const testDestination = [];

const amountMoved = moveCards(
  testSource,
  testDestination,
  3
);

console.log("Amount Moved:", amountMoved);
console.log("Source:", testSource);
console.log("Destination:", testDestination);


// ------------------------------
// CURRENT GAME STATE
// ------------------------------

console.log("Player A Tower:", playerATower);
console.log("Player B Tower:", playerBTower);
console.log("Draw Pile:", drawPile);