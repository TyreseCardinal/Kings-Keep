import {
  createDeck,
  createTowerCreationDeck,
  shuffleDeck,
  dealTowerCards,
  dealStartingKings,
  createDrawPile,
} from "./systems/deckSystem.js";

import { createPlayer, drawStartingHand } from "./systems/playerSystem.js";

import { moveCards } from "./systems/cardLifecycleSystem.js";

import { getActiveWall, getHiddenWalls, getKing } from "./systems/towerSystem.js";

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
drawStartingHand(playerB, drawPile);

const playerAActiveWall = getActiveWall(playerA);
const playerBActiveWall = getActiveWall(playerB);

const playerAHiddenWalls = getHiddenWalls(playerA);
const playerBHiddenWalls = getHiddenWalls(playerB);

const playerAKingCard = getKing(playerA);
const playerBKingCard = getKing(playerB);


// ------------------------------
// CURRENT GAME STATE
// ------------------------------

console.log("Draw Pile:", drawPile.length);

console.log("Player A:", playerA);
console.log("Player A Active Wall:", playerAActiveWall);
console.log("Player A Hidden Walls:", playerAHiddenWalls);
console.log("Player A King:", playerAKingCard);

console.log("Player B:", playerB);
console.log("Player B Active Wall:", playerBActiveWall);
console.log("Player B Hidden Walls:", playerBHiddenWalls);
console.log("Player B King:", playerBKingCard);