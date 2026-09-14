// IMPORTS

// Deck System Imports

import {
  createDeck,
  createTowerCreationDeck,
  shuffleDeck,
  dealTowerCards,
  dealStartingKings,
  createDrawPile,
} from "./systems/deckSystem.js";

// Player System Imports

import {
  createPlayer,
  drawStartingHand,
} from "./systems/playerSystem.js";

// Card Lifecycle System Imports

import {
  moveCards,
} from "./systems/cardLifecycleSystem.js";

// Tower System Imports

import {
  getActiveWall,
} from "./systems/towerSystem.js";

// Wall System Imports

import {
  createWallState,
} from "./systems/wallSystem.js";

import {
  createKingState,
} from "./systems/kingSystem.js";

// DECK SYSTEM FUNCTIONS

// Create Deck

const deck = createDeck();

// Create Tower Creation Deck and Special Reserve

const {
  towerCreationDeck,
  specialReserve,
} = createTowerCreationDeck(deck);

// Shuffle Tower Creation Deck

shuffleDeck(towerCreationDeck);

// Deal Tower Cards

const {
  playerATower,
  playerBTower,
} = dealTowerCards(towerCreationDeck);

// Deal Starting Kings

const {
  playerAKing,
  playerBKing,
} = dealStartingKings(specialReserve);

// Create Draw Pile

const drawPile = createDrawPile(
  towerCreationDeck,
  specialReserve,
);

// Create Dead Pile

const deadPile = [];

// PLAYER SYSTEM FUNCTIONS

// Create Players

const playerA = createPlayer(1);

const playerB = createPlayer(2);

// Add Starting Kings to Towers

playerATower.push(playerAKing);

playerBTower.push(playerBKing);

// Transfer Towers to Players

moveCards(
  playerATower,
  playerA.tower,
  playerATower.length,
);

moveCards(
  playerBTower,
  playerB.tower,
  playerBTower.length,
);

// Create King States

playerA.kingState = createKingState(
  playerA.tower[
    playerA.tower.length - 1
  ],
);

playerB.kingState = createKingState(
  playerB.tower[
    playerB.tower.length - 1
  ],
);

// Draw Starting Hands

drawStartingHand(
  playerA,
  drawPile,
);

drawStartingHand(
  playerB,
  drawPile,
);

drawStartingHand(
  playerA,
  drawPile,
);

drawStartingHand(
  playerB,
  drawPile,
);

// TOWER SYSTEM FUNCTIONS

// Get Active Walls

const playerAActiveWall = getActiveWall(
  playerA,
);

const playerBActiveWall = getActiveWall(
  playerB,
);

// WALL SYSTEM FUNCTIONS

// Create Active Wall States

playerA.activeWallState = createWallState(
  playerAActiveWall,
);

playerB.activeWallState = createWallState(
  playerBActiveWall,
);

// TESTING

// Current Game State

console.log(
  "Draw Pile:",
  drawPile.length,
);

console.log(
  "Dead Pile:",
  deadPile,
);

console.log(
  "Player A:",
  playerA,
);

console.log(
  "Player A Wall State:",
  playerA.activeWallState,
);


console.log(
  "Player B:",
  playerB,
);

console.log(
  "Player B Wall State:",
  playerB.activeWallState,
);

console.log(
  "Player A Tower King Matches King State:",
  playerA.tower[
    playerA.tower.length - 1
  ] === playerA.kingState.card,
);

console.log(
  "Player B Tower King Matches King State:",
  playerB.tower[
    playerB.tower.length - 1
  ] === playerB.kingState.card,
);

console.log(
  "Player A King HP:",
  playerA.kingState.currentHp,
);

console.log(
  "Player B King HP:",
  playerB.kingState.currentHp,
);