import { createCard } from "../systems/cardSystem.js";

import { isSiegeSpecialCard } from "../systems/specialCardSystem.js";

import {
  isAce,
  canResolveAce,
  resolveAceEffect,
} from "../systems/specialCards/ace/aceSystem.js";

import { createPlayer } from "../systems/playerSystem.js";

import {
  canPlayToSiege,
  playSiegeCard,
  resolveSiegeLanes,
} from "../systems/siegeSystem.js";

// ============================================================
// SIEGE SPECIAL CLASSIFICATION TESTS
// ============================================================

const ace = createCard("hearts", "ace");
const jack = createCard("clubs", "jack");
const queen = createCard("spades", "queen");
const king = createCard("diamonds", "king");
const numberCard = createCard("hearts", "10");

console.log("Ace Is Siege Special:", isSiegeSpecialCard(ace));

console.log("Jack Is Siege Special:", isSiegeSpecialCard(jack));

console.log("Queen Is Siege Special:", isSiegeSpecialCard(queen));

console.log("King Is Not Siege Special:", isSiegeSpecialCard(king) === false);

console.log(
  "Number Card Is Not Siege Special:",
  isSiegeSpecialCard(numberCard) === false,
);

// ============================================================
// SIEGE ENTRY RESTRICTION TESTS
// ============================================================

const siegeRestrictionPlayer = createPlayer("siege-restriction-player");

const siegeAce = createCard("hearts", "ace");
const siegeJack = createCard("clubs", "jack");
const siegeQueen = createCard("spades", "queen");
const siegeKing = createCard("diamonds", "king");
const siegeNumber = createCard("hearts", "8");

console.log(
  "Ace Can Enter Siege:",
  canPlayToSiege(siegeRestrictionPlayer, siegeAce, "left"),
);

console.log(
  "Jack Can Enter Siege:",
  canPlayToSiege(siegeRestrictionPlayer, siegeJack, "left"),
);

console.log(
  "Queen Can Enter Siege:",
  canPlayToSiege(siegeRestrictionPlayer, siegeQueen, "left"),
);

console.log(
  "King Rejected From Siege:",
  canPlayToSiege(siegeRestrictionPlayer, siegeKing, "left") === false,
);

console.log(
  "Number Still Allowed In Siege:",
  canPlayToSiege(siegeRestrictionPlayer, siegeNumber, "left"),
);

// ============================================================
// ACE IDENTIFICATION TESTS
// ============================================================

const aceTestCard = createCard("hearts", "ace");

const jackTestCard = createCard("hearts", "jack");

const kingTestCard = createCard("hearts", "king");

const aceNumberCard = createCard("hearts", "8");

console.log("Ace Identified As Ace:", isAce(aceTestCard));

console.log("Jack Not Identified As Ace:", isAce(jackTestCard) === false);

console.log("King Not Identified As Ace:", isAce(kingTestCard) === false);

console.log("Number Not Identified As Ace:", isAce(aceNumberCard) === false);

// ============================================================
// SUCCESSFUL ACE RESOLUTION TEST
// ============================================================

const acePlayerA = createPlayer("ace-player-a");

const acePlayerB = createPlayer("ace-player-b");

const aceWinningNumber = createCard("hearts", "10");

const aceLosingNumber = createCard("clubs", "5");

const resolvingAce = createCard("hearts", "ace");

acePlayerA.hand.push(aceWinningNumber);

acePlayerA.specialHand.push(resolvingAce);

acePlayerB.hand.push(aceLosingNumber);

playSiegeCard(acePlayerA, aceWinningNumber, "left");

playSiegeCard(acePlayerA, resolvingAce, "center");

playSiegeCard(acePlayerB, aceLosingNumber, "left");

const aceSiegeResults = resolveSiegeLanes(acePlayerA, acePlayerB);

console.log("Ace Resolution Siege Results:", aceSiegeResults);

console.log(
  "Ace Can Resolve After Numbered Lane Win:",
  canResolveAce(acePlayerA, acePlayerB, aceSiegeResults, "playerA"),
);

// ============================================================
// ACE FAILS WITHOUT NUMBERED LANE WIN
// ============================================================

const failedAcePlayerA = createPlayer("failed-ace-player-a");

const failedAcePlayerB = createPlayer("failed-ace-player-b");

const failedAceNumberA = createCard("hearts", "5");

const failedAceNumberB = createCard("clubs", "10");

const failedResolvingAce = createCard("spades", "ace");

failedAcePlayerA.hand.push(failedAceNumberA);

failedAcePlayerA.specialHand.push(failedResolvingAce);

failedAcePlayerB.hand.push(failedAceNumberB);

playSiegeCard(failedAcePlayerA, failedAceNumberA, "left");

playSiegeCard(failedAcePlayerA, failedResolvingAce, "center");

playSiegeCard(failedAcePlayerB, failedAceNumberB, "left");

const failedAceResults = resolveSiegeLanes(failedAcePlayerA, failedAcePlayerB);

console.log("Failed Ace Siege Results:", failedAceResults);

console.log(
  "Ace Rejected Without Numbered Lane Win:",
  canResolveAce(
    failedAcePlayerA,
    failedAcePlayerB,
    failedAceResults,
    "playerA",
  ) === false,
);

// ============================================================
// MATCHING ACE CANCELS ACE
// ============================================================

const cancelledAcePlayerA = createPlayer("cancelled-ace-player-a");

const cancelledAcePlayerB = createPlayer("cancelled-ace-player-b");

const cancelledAceNumberA = createCard("hearts", "10");

const cancelledAceNumberB = createCard("clubs", "5");

const cancelledAceA = createCard("hearts", "ace");

const cancelledAceB = createCard("clubs", "ace");

cancelledAcePlayerA.hand.push(cancelledAceNumberA);

cancelledAcePlayerA.specialHand.push(cancelledAceA);

cancelledAcePlayerB.hand.push(cancelledAceNumberB);

cancelledAcePlayerB.specialHand.push(cancelledAceB);

playSiegeCard(cancelledAcePlayerA, cancelledAceNumberA, "left");

playSiegeCard(cancelledAcePlayerA, cancelledAceA, "center");

playSiegeCard(cancelledAcePlayerB, cancelledAceNumberB, "left");

playSiegeCard(cancelledAcePlayerB, cancelledAceB, "center");

const cancelledAceResults = resolveSiegeLanes(
  cancelledAcePlayerA,
  cancelledAcePlayerB,
);

console.log("Cancelled Ace Siege Results:", cancelledAceResults);

console.log(
  "Matching Ace Prevents Ace Resolution:",
  canResolveAce(
    cancelledAcePlayerA,
    cancelledAcePlayerB,
    cancelledAceResults,
    "playerA",
  ) === false,
);

// ============================================================
// ACE DESTROYS ACTIVE WALL
// ============================================================

const aceTargetWallCard = createCard("diamonds", "7");

const aceNextWallCard = createCard("clubs", "4");

acePlayerB.tower.push(aceTargetWallCard, aceNextWallCard);

const aceTargetWall = {
  card: aceTargetWallCard,
  baseHp: aceTargetWallCard.baseValue,
  currentHp: aceTargetWallCard.baseValue,
  fortification: null,
};

const aceDeadPile = [];

console.log("Ace Target Tower Before:", acePlayerB.tower.length);

console.log("Ace Target HP Before:", aceTargetWall.currentHp);

console.log("Ace Dead Pile Before:", aceDeadPile.length);

const aceNewWallState = resolveAceEffect(
  acePlayerA,
  acePlayerB,
  aceSiegeResults,
  "playerA",
  aceTargetWall,
  aceDeadPile,
);

console.log("Ace Effect Resolved:", aceNewWallState !== false);

console.log(
  "Ace Returned New Wall State:",
  aceNewWallState?.card === aceNextWallCard,
);

console.log("Ace Target HP After:", aceTargetWall.currentHp);

console.log("Ace Target Tower After:", acePlayerB.tower.length);

console.log("Ace Dead Pile After:", aceDeadPile.length);

console.log(
  "Ace Destroyed Active Wall:",
  acePlayerB.tower.length === 1 && aceDeadPile.includes(aceTargetWallCard),
);

console.log(
  "Next Wall Became Active:",
  acePlayerB.tower[0] === aceNextWallCard,
);

// ============================================================
// FAILED ACE DOES NOT DESTROY WALL
// ============================================================

const failedAceTargetCard = createCard("spades", "8");

const failedAceNextCard = createCard("diamonds", "6");

failedAcePlayerB.tower.push(failedAceTargetCard, failedAceNextCard);

const failedAceTargetWall = {
  card: failedAceTargetCard,
  baseHp: failedAceTargetCard.baseValue,
  currentHp: failedAceTargetCard.baseValue,
  fortification: null,
};

const failedAceDeadPile = [];

const failedAceEffectResolved = resolveAceEffect(
  failedAcePlayerA,
  failedAcePlayerB,
  failedAceResults,
  "playerA",
  failedAceTargetWall,
  failedAceDeadPile,
);

console.log("Failed Ace Effect Rejected:", failedAceEffectResolved === false);

console.log(
  "Failed Ace Preserves Wall HP:",
  failedAceTargetWall.currentHp === 8,
);

console.log(
  "Failed Ace Preserves Tower:",
  failedAcePlayerB.tower.length === 2 &&
    failedAcePlayerB.tower[0] === failedAceTargetCard,
);

console.log("Failed Ace Preserves Dead Pile:", failedAceDeadPile.length === 0);
