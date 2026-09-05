// IMPORTS

// Card System Imports

import { createCard } from "../systems/cardSystem.js";

// Player System Imports

import { createPlayer } from "../systems/playerSystem.js";

// Tower System Imports

import { advanceTower, getActiveWall } from "../systems/towerSystem.js";

// Wall System Imports

import {
  createWallState,
  applyWallDamage,
  isWallDestroyed,
} from "../systems/wallSystem.js";

// Fortification System Imports

import {
  canFortify,
  canConvert,
  fortifyWall,
  hasFortification,
  convertFortification,
} from "../systems/fortificationSystem.js";

// TEST SETUP

// Create Test Player

const testPlayer = createPlayer("test-player");

// Create Test Cards

const testWallCard = createCard("spades", "7");

const testFortificationCard = createCard("hearts", "7");

const testNextWallCard = createCard("clubs", "4");

const testReplacementCard = createCard("diamonds", "7");

const testKingCard = createCard("diamonds", "king");

// Create Test Tower

testPlayer.tower.push(testWallCard, testNextWallCard, testKingCard);

// Create Test Hand

testPlayer.hand.push(
  testFortificationCard,
  testReplacementCard,
);

// Create Test Dead Pile

const testDeadPile = [];

// Create Test Wall State

const testWallState = createWallState(getActiveWall(testPlayer));

// FORTIFICATION SYSTEM TESTING

// Fortification Attachment Test

console.log("Can Fortify:", canFortify(testWallState, testFortificationCard));

console.log("Hand Before Fortification:", testPlayer.hand.length);

console.log("Wall HP Before Fortification:", testWallState.currentHp);

console.log("Has Fortification Before:", hasFortification(testWallState));

fortifyWall(testPlayer, testWallState, testFortificationCard);

console.log("Hand After Fortification:", testPlayer.hand.length);

console.log("Wall HP After Fortification:", testWallState.currentHp);

console.log("Has Fortification After:", hasFortification(testWallState));

console.log("Attached Fortification:", testWallState.fortification);

// FORTIFICATION CONVERT TEST

console.log(
  "Can Convert Existing Fortification:",
  canConvert(
    testWallState,
    testReplacementCard,
  ),
);

console.log(
  "Hand Before Convert:",
  testPlayer.hand.length,
);

console.log(
  "Dead Pile Before Convert:",
  testDeadPile.length,
);

console.log(
  "Wall HP Before Convert:",
  testWallState.currentHp,
);

console.log(
  "Fortification Before Convert:",
  testWallState.fortification,
);

convertFortification(
  testPlayer,
  testWallState,
  testReplacementCard,
  testDeadPile,
);

console.log(
  "Hand After Convert:",
  testPlayer.hand.length,
);

console.log(
  "Dead Pile After Convert:",
  testDeadPile.length,
);

console.log(
  "Wall HP After Convert:",
  testWallState.currentHp,
);

console.log(
  "Fortification After Convert:",
  testWallState.fortification,
);

// Convert With Card Not In Hand Test

const missingCardPlayer = createPlayer(
  "missing-card-player",
);

const missingCardWallCard = createCard(
  "spades",
  "7",
);

const existingFortificationCard = createCard(
  "hearts",
  "7",
);

const missingReplacementCard = createCard(
  "diamonds",
  "7",
);

missingCardPlayer.tower.push(
  missingCardWallCard,
);

missingCardPlayer.hand.push(
  existingFortificationCard,
);

const missingCardWallState = createWallState(
  getActiveWall(missingCardPlayer),
);

const missingCardDeadPile = [];

fortifyWall(
  missingCardPlayer,
  missingCardWallState,
  existingFortificationCard,
);

const hpBeforeInvalidConvert =
  missingCardWallState.currentHp;

const deadPileBeforeInvalidConvert =
  missingCardDeadPile.length;

convertFortification(
  missingCardPlayer,
  missingCardWallState,
  missingReplacementCard,
  missingCardDeadPile,
);

console.log(
  "Fortification Preserved After Invalid Convert:",
  hasFortification(missingCardWallState),
);

console.log(
  "Wall HP Preserved After Invalid Convert:",
  missingCardWallState.currentHp ===
    hpBeforeInvalidConvert,
);

console.log(
  "Dead Pile Preserved After Invalid Convert:",
  missingCardDeadPile.length ===
    deadPileBeforeInvalidConvert,
);

console.log(
  "Original Fortification Preserved:",
  missingCardWallState.fortification.card.id ===
    existingFortificationCard.id,
);

// FORTIFIED WALL DESTRUCTION TEST

console.log(
  "Tower Before Fortified Wall Destruction:",
  testPlayer.tower.length,
);

console.log(
  "Dead Pile Before Fortified Wall Destruction:",
  testDeadPile.length,
);

console.log(
  "Has Fortification Before Destruction:",
  hasFortification(testWallState),
);

applyWallDamage(testWallState, testWallState.currentHp);

console.log("Fortified Wall Destroyed:", isWallDestroyed(testWallState));

const nextWallState = advanceTower(testPlayer, testWallState, testDeadPile);

console.log("Tower After Fortified Wall Destruction:", testPlayer.tower.length);

console.log("Dead Pile After Fortified Wall Destruction:", testDeadPile.length);

console.log("Destroyed Wall Fortification:", testWallState.fortification);

console.log("New Active Wall:", getActiveWall(testPlayer));

console.log("New Wall State:", nextWallState);

// CONVERT REJECTION TESTING

// Convert Without Existing Fortification Test

const noFortificationPlayer = createPlayer(
  "no-fortification-player",
);

const noFortificationWallCard = createCard(
  "spades",
  "7",
);

const noFortificationReplacementCard = createCard(
  "diamonds",
  "7",
);

noFortificationPlayer.tower.push(
  noFortificationWallCard,
);

noFortificationPlayer.hand.push(
  noFortificationReplacementCard,
);

const noFortificationWallState = createWallState(
  getActiveWall(noFortificationPlayer),
);

console.log(
  "Can Convert Without Fortification:",
  canConvert(
    noFortificationWallState,
    noFortificationReplacementCard,
  ),
);

// --------------------------------------------------
// TEST: Fortification is depleted by normal damage
// --------------------------------------------------

const damageWallCard = createCard(
  "hearts",
  "7",
);

const damageFortificationCard = createCard(
  "clubs",
  "7",
);

const damageWall = createWallState(
  damageWallCard,
);

const damagePlayer = {
  hand: [
    damageFortificationCard,
  ],
};

const damageDeadPile = [];

fortifyWall(
  damagePlayer,
  damageWall,
  damageFortificationCard,
);

console.log(
  "Damage Test Starting HP:",
  damageWall.currentHp,
);

// 14 -> 8
applyWallDamage(
  damageWall,
  6,
  damageDeadPile,
);

console.log(
  "Fortification Survives At 8 HP:",
  damageWall.fortification !== null,
);

console.log(
  "Wall HP After First Damage:",
  damageWall.currentHp,
);

console.log(
  "Dead Pile Still Empty At 8 HP:",
  damageDeadPile.length === 0,
);

// 8 -> 7
applyWallDamage(
  damageWall,
  1,
  damageDeadPile,
);

console.log(
  "Wall HP At Fortification Boundary:",
  damageWall.currentHp,
);

console.log(
  "Fortification Removed At 7 HP:",
  damageWall.fortification === null,
);

console.log(
  "Depleted Fortification Entered Dead Pile:",
  damageDeadPile.includes(
    damageFortificationCard,
  ),
);

console.log(
  "Underlying Wall Survives At 7 HP:",
  damageWall.currentHp === 7,
);

// --------------------------------------------------
// TEST: Normal damage penetrates depleted
// Fortification and damages underlying Wall
// --------------------------------------------------

const penetrationWallCard = createCard(
  "hearts",
  "7",
);

const penetrationFortificationCard = createCard(
  "clubs",
  "7",
);

const penetrationWall = createWallState(
  penetrationWallCard,
);

const penetrationPlayer = {
  hand: [
    penetrationFortificationCard,
  ],
};

const penetrationDeadPile = [];

fortifyWall(
  penetrationPlayer,
  penetrationWall,
  penetrationFortificationCard,
);

console.log(
  "Penetration Test Starting HP:",
  penetrationWall.currentHp,
);

applyWallDamage(
  penetrationWall,
  9,
  penetrationDeadPile,
);

console.log(
  "Penetration Damage Leaves Wall At 5:",
  penetrationWall.currentHp === 5,
);

console.log(
  "Penetrated Fortification Removed:",
  penetrationWall.fortification === null,
);

console.log(
  "Penetrated Fortification Entered Dead Pile:",
  penetrationDeadPile.includes(
    penetrationFortificationCard,
  ),
);

console.log(
  "Normal Damage Did Not Clamp Wall Back To 7:",
  penetrationWall.currentHp !==
    penetrationWall.baseHp,
);