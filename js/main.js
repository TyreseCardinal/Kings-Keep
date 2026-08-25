import {
  createDeck,
  createTowerCreationDeck,
  shuffleDeck,
  dealTowerCards,
  dealStartingKings,
  createDrawPile,
} from "./systems/deckSystem.js";

import { createPlayer, drawCard } from "./systems/playerSystem.js";

import { moveCards } from "./systems/cardLifecycleSystem.js";

const deck = createDeck();

const { towerCreationDeck, specialReserve } = createTowerCreationDeck(deck);

shuffleDeck(towerCreationDeck);

const { playerATower, playerBTower } = dealTowerCards(towerCreationDeck);

const { playerAKing, playerBKing } = dealStartingKings(specialReserve);

const drawPile = createDrawPile(towerCreationDeck, specialReserve);

playerATower.push(playerAKing);
playerBTower.push(playerBKing);

const playerA = createPlayer(1);
const playerB = createPlayer(2);

moveCards(playerATower, playerA.tower, playerATower.length);

moveCards(playerBTower, playerB.tower, playerBTower.length);

// ------------------------------
// CURRENT GAME STATE
// ------------------------------

console.log("Player A:", playerA);
console.log("Player B:", playerB);
console.log("Old Player A Tower:", playerATower);
console.log("Old Player B Tower:", playerBTower);

console.log("Before Draw:");
console.log("Draw Pile:", drawPile.length);
console.log("Player A Hand:", playerA.hand.length);
console.log("Player A Special Hand:", playerA.specialHand.length);

drawCard(playerA, drawPile);

console.log("After Draw:");
console.log("Draw Pile:", drawPile.length);
console.log("Player A Hand:", playerA.hand.length);
console.log("Player A Special Hand:", playerA.specialHand.length);
