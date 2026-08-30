// IMPORTS

// Card System Imports
import {
  createCard,
} from "../systems/cardSystem.js";

// Player System Imports
import {
  createPlayer,
} from "../systems/playerSystem.js";

// Tower System Imports
import {
  getActiveWall,
  isKingActive,
  advanceTower,
} from "../systems/towerSystem.js";

// Wall System Imports
import {
  createWallState,
  applyWallDamage,
  isWallDestroyed,
} from "../systems/wallSystem.js";

// TEST SETUP

// Create Test Player
const testPlayer = createPlayer("test-player");

// Create Test Cards
const testWallCard = createCard(
  "spades",
  "7",
);

const testNextWallCard = createCard(
  "clubs",
  "4",
);

const testKingCard = createCard(
  "diamonds",
  "king",
);

// Create Test Tower
testPlayer.tower.push(
  testWallCard,
  testNextWallCard,
  testKingCard,
);

// Create Test Dead Pile
const testDeadPile = [];

// Create Test Wall State
const testWallState = createWallState(
  getActiveWall(testPlayer),
);

// WALL SYSTEM TESTING

// Wall Destruction Test
console.log(
  "Tower Before Destruction:",
  testPlayer.tower.length,
);

console.log(
  "Dead Pile Before Destruction:",
  testDeadPile.length,
);

applyWallDamage(
  testWallState,
  20,
);

console.log(
  "Wall Destroyed:",
  isWallDestroyed(testWallState),
);

// Tower Advancement Test
const newWallState = advanceTower(
  testPlayer,
  testWallState,
  testDeadPile,
);

console.log(
  "Tower After Advancement:",
  testPlayer.tower.length,
);

console.log(
  "Dead Pile After Advancement:",
  testDeadPile.length,
);

console.log(
  "New Active Wall:",
  getActiveWall(testPlayer),
);

console.log(
  "New Wall State:",
  newWallState,
);

console.log(
  "Test Player King Active:",
  isKingActive(testPlayer),
);