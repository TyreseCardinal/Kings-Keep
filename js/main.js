import {
  createDeck,
  createTowerCreationDeck,
  shuffleDeck,
  dealTowerCards,
  dealStartingKings,
  createDrawPile,
} from "./systems/deckSystem.js";

import {
  createPlayer,
  drawStartingHand,
} from "./systems/playerSystem.js";

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

drawStartingHand(playerA, drawPile);

// ------------------------------
// CURRENT GAME STATE
// ------------------------------

console.log("Player A:", playerA);
console.log("Player B:", playerB);
console.log("Draw Pile:", drawPile.length);



