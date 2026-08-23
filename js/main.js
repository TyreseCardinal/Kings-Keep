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
  recycleDeadPile,
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
// TEST: recycleDeadPile()
// ------------------------------

const testDeadPile = [];

// Move every remaining draw-pile card into the dead pile
moveCards(
  drawPile,
  testDeadPile,
  drawPile.length
);

console.log("Before Recycle:");
console.log("Draw Pile Length:", drawPile.length);
console.log("Dead Pile Length:", testDeadPile.length);

recycleDeadPile(
  drawPile,
  testDeadPile,
  shuffleDeck
);

console.log("After Recycle:");
console.log("Draw Pile Length:", drawPile.length);
console.log("Dead Pile Length:", testDeadPile.length);
console.log("Recycled Draw Pile:", drawPile);


// ------------------------------
// TEST: recycleDeadPile() guard
// ------------------------------

const guardDeadPile = [];

moveCards(
  drawPile,
  guardDeadPile,
  5
);

const drawPileBefore = drawPile.length;
const deadPileBefore = guardDeadPile.length;

recycleDeadPile(
  drawPile,
  guardDeadPile,
  shuffleDeck
);

console.log("Recycle Guard Test:");
console.log("Draw Before:", drawPileBefore);
console.log("Draw After:", drawPile.length);
console.log("Dead Before:", deadPileBefore);
console.log("Dead After:", guardDeadPile.length);


// ------------------------------
// CURRENT GAME STATE
// ------------------------------

console.log("Player A Tower:", playerATower);
console.log("Player B Tower:", playerBTower);
console.log("Draw Pile:", drawPile);