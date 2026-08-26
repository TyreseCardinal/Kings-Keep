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
import { createPlayer, drawStartingHand } from "./systems/playerSystem.js";

// Card Lifecycle System Imports
import { moveCards } from "./systems/cardLifecycleSystem.js";

// Tower System Imports
import {
  getActiveWall,
  getHiddenWalls,
  getKing,
  isKingActive,
  advanceTower,
} from "./systems/towerSystem.js";

// Wall System Imports
import {
  createWallState,
  applyWallDamage,
  isWallDestroyed,
} from "./systems/wallSystem.js";

// DECK SYSTEM FUNCTIONS

// Create Deck
const deck = createDeck();

// Create Tower Creation Deck and Special Reserve
const { towerCreationDeck, specialReserve } = createTowerCreationDeck(deck);

// Shuffle Tower Creation Deck
shuffleDeck(towerCreationDeck);

// Deal Tower Cards
const { playerATower, playerBTower } = dealTowerCards(towerCreationDeck);

// Deal Starting Kings
const { playerAKing, playerBKing } = dealStartingKings(specialReserve);

// Create Draw Pile
const drawPile = createDrawPile(towerCreationDeck, specialReserve);

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
moveCards(playerATower, playerA.tower, playerATower.length);

moveCards(playerBTower, playerB.tower, playerBTower.length);

// Draw Starting Hands
drawStartingHand(playerA, drawPile);
drawStartingHand(playerB, drawPile);

// TOWER SYSTEM FUNCTIONS

// Get Active Walls
const playerAActiveWall = getActiveWall(playerA);
const playerBActiveWall = getActiveWall(playerB);

// Get Hidden Walls
const playerAHiddenWalls = getHiddenWalls(playerA);
const playerBHiddenWalls = getHiddenWalls(playerB);

// Get Kings
const playerAKingCard = getKing(playerA);
const playerBKingCard = getKing(playerB);

// WALL SYSTEM FUNCTIONS

// Create Active Wall States
const playerAWallState = createWallState(playerAActiveWall);
const playerBWallState = createWallState(playerBActiveWall);

// TESTING

// Current Game State
console.log("Draw Pile:", drawPile.length);
console.log("Dead Pile:", deadPile);

console.log("Player A:", playerA);
console.log("Player A Active Wall:", playerAActiveWall);
console.log("Player A Wall State:", playerAWallState);
console.log("Player A Hidden Walls:", playerAHiddenWalls);
console.log("Player A King:", playerAKingCard);

console.log("Player B:", playerB);
console.log("Player B Active Wall:", playerBActiveWall);
console.log("Player B Wall State:", playerBWallState);
console.log("Player B Hidden Walls:", playerBHiddenWalls);
console.log("Player B King:", playerBKingCard);

// Wall Destruction Test

console.log("Tower Before Destruction:", playerA.tower.length);

console.log("Dead Pile Before Destruction:", deadPile.length);

console.log("Active Wall Before Destruction:", getActiveWall(playerA));

applyWallDamage(playerAWallState, 20);

console.log("Wall HP:", playerAWallState.currentHp);

console.log("Wall Destroyed:", isWallDestroyed(playerAWallState));

const newWallState = advanceTower(playerA, playerAWallState, deadPile);

console.log("Tower After Advancement:", playerA.tower.length);

console.log("Dead Pile After Advancement:", deadPile.length);

console.log("New Active Wall:", getActiveWall(playerA));

console.log("New Wall State:", newWallState);

console.log("Dead Pile:", deadPile);

console.log("Player A King Active:", isKingActive(playerA));
