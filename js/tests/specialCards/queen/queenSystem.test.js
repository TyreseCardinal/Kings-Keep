import { createCard } from "../../../systems/cardSystem.js";

import {
  createSiege,
  setSiegeSpecialState,
  getSweepSpecialSuit,
  resolveSiegeLanes,
  getBaseSiegeDamage,
  getFinalSiegeDamage,
  areSiegeSpecialsCancelled,
} from "../../../systems/siegeSystem.js";

import {
  isQueen,
  isValidQueenSuit,
  createQueenState,
} from "../../../systems/specialCards/queen/queenSystem.js";

console.log("----- QUEEN SYSTEM TESTS -----");

const queen = createCard("hearts", "queen");

const ace = createCard("hearts", "ace");

const numberCard = createCard("hearts", "8");

console.log("Queen Identified As Queen:", isQueen(queen));

console.log("Ace Not Identified As Queen:", !isQueen(ace));

console.log("Number Not Identified As Queen:", !isQueen(numberCard));

console.log("Queen Printed Siege Value Remains Zero:", queen.siegeValue === 0);

console.log("Hearts Is Valid Queen Suit:", isValidQueenSuit("hearts"));

console.log("Spades Is Valid Queen Suit:", isValidQueenSuit("spades"));

console.log("Invalid Queen Suit Rejected:", !isValidQueenSuit("purple"));

const queenOriginalSuit = queen.suit;

const queenState = createQueenState(queen, "spades");

console.log("Queen State Created:", queenState !== undefined);

console.log("Queen State Contains Original Card:", queenState.card === queen);

console.log(
  "Queen Declared Suit Is Spades:",
  queenState.declaredSuit === "spades",
);

console.log(
  "Queen Printed Suit Still Hearts:",
  queen.suit === queenOriginalSuit && queen.suit === "hearts",
);

console.log(
  "Invalid Declared Suit Rejects Queen State:",
  createQueenState(queen, "purple") === undefined,
);

console.log(
  "Non-Queen Cannot Create Queen State:",
  createQueenState(ace, "spades") === undefined,
);

// --------------------------------------------------
// TEST: Queen declared suit is stored in Siege state
// --------------------------------------------------

const queenSiege = createSiege();

console.log(
  "Queen Siege Special State Starts Null:",
  queenSiege.specialState === null,
);

const storedQueenState = setSiegeSpecialState(queenSiege, queenState);

console.log(
  "Queen State Stored In Siege:",
  queenSiege.specialState === queenState,
);

console.log("Stored Queen State Returned:", storedQueenState === queenState);

console.log(
  "Stored Queen Card Is Original Queen:",
  queenSiege.specialState.card === queen,
);

console.log(
  "Stored Queen Declared Suit Is Spades:",
  queenSiege.specialState.declaredSuit === "spades",
);

console.log(
  "Stored Queen Still Has Printed Hearts Suit:",
  queenSiege.specialState.card.suit === "hearts",
);

// --------------------------------------------------
// TEST: Queen declared suit is used as Special suit
// --------------------------------------------------

const queenSuitPlayer = {
  id: 1,
  hand: [],
  specialHand: [],
  tower: [],
  siege: createSiege(),
};

const queenSuitOpponent = {
  id: 2,
  hand: [],
  specialHand: [],
  tower: [],
  siege: createSiege(),
};

const queenSuitNumber = createCard("clubs", "8");

const queenSuitOpponentNumber = createCard("diamonds", "6");

queenSuitPlayer.siege.left.push(queenSuitNumber);

queenSuitPlayer.siege.center.push(queen);

queenSuitOpponent.siege.left.push(queenSuitOpponentNumber);

setSiegeSpecialState(queenSuitPlayer.siege, queenState);

const queenSuitResults = {
  left: "playerA",
  center: "tie",
  right: "tie",
};

const queenSpecialSuit = getSweepSpecialSuit(
  queenSuitPlayer,
  queenSuitOpponent,
  queenSuitResults,
  "playerA",
);

console.log(
  "Queen Special Suit Uses Declared Spades:",
  queenSpecialSuit === "spades",
);

console.log(
  "Queen Special Suit Ignores Printed Hearts:",
  queenSpecialSuit !== queen.suit,
);

console.log(
  "Queen Printed Suit Still Hearts After Resolution:",
  queen.suit === "hearts",
);

// --------------------------------------------------
// TEST: Queen declared suit activates Suit Repetition
// --------------------------------------------------

const repetitionPlayer = {
  id: 1,
  hand: [],
  specialHand: [],
  tower: [],
  siege: createSiege(),
};

const repetitionOpponent = {
  id: 2,
  hand: [],
  specialHand: [],
  tower: [],
  siege: createSiege(),
};

const repetitionNumber = createCard("spades", "8");

const repetitionOpponentNumber = createCard("clubs", "6");

const repetitionQueen = createCard("hearts", "queen");

const repetitionQueenState = createQueenState(repetitionQueen, "spades");

repetitionPlayer.siege.left.push(repetitionNumber);

repetitionPlayer.siege.center.push(repetitionQueen);

repetitionOpponent.siege.left.push(repetitionOpponentNumber);

setSiegeSpecialState(repetitionPlayer.siege, repetitionQueenState);

const repetitionResults = resolveSiegeLanes(
  repetitionPlayer,
  repetitionOpponent,
);

console.log("Queen Repetition Siege Results:", repetitionResults);

const repetitionBaseDamage = getBaseSiegeDamage(
  repetitionPlayer,
  repetitionResults,
  "playerA",
);

console.log("Queen Base Numbered Damage:", repetitionBaseDamage);

console.log("Queen Base Damage Is 8:", repetitionBaseDamage === 8);

const repetitionWall = createCard("spades", "7");

const repetitionSpecialSuit = getSweepSpecialSuit(
  repetitionPlayer,
  repetitionOpponent,
  repetitionResults,
  "playerA",
);

console.log(
  "Queen Repetition Uses Declared Spades:",
  repetitionSpecialSuit === "spades",
);

const repetitionFinalDamage = getFinalSiegeDamage(
  repetitionPlayer,
  repetitionOpponent,
  repetitionResults,
  "playerA",
  repetitionWall,
);

console.log("Queen Final Siege Damage:", repetitionFinalDamage);

console.log(
  "Queen Declared Suit Repeats Number Damage:",
  repetitionFinalDamage === 16,
);

console.log(
  "Queen Still Contributes Zero Numeric Damage:",
  repetitionFinalDamage === repetitionBaseDamage * 2,
);

console.log(
  "Queen Printed Hearts Suit Still Unchanged:",
  repetitionQueen.suit === "hearts",
);

// --------------------------------------------------
// TEST: Queen vs Queen cancellation ignores declared suits
// --------------------------------------------------

const queenCancelPlayer = {
  id: 1,
  hand: [],
  specialHand: [],
  tower: [],
  siege: createSiege(),
};

const queenCancelOpponent = {
  id: 2,
  hand: [],
  specialHand: [],
  tower: [],
  siege: createSiege(),
};

const playerQueen = createCard("hearts", "queen");

const opponentQueen = createCard("clubs", "queen");

const playerQueenState = createQueenState(playerQueen, "spades");

const opponentQueenState = createQueenState(opponentQueen, "diamonds");

queenCancelPlayer.siege.center.push(playerQueen);

queenCancelOpponent.siege.center.push(opponentQueen);

setSiegeSpecialState(queenCancelPlayer.siege, playerQueenState);

setSiegeSpecialState(queenCancelOpponent.siege, opponentQueenState);

console.log(
  "Queen Vs Queen Cancels:",
  areSiegeSpecialsCancelled(queenCancelPlayer, queenCancelOpponent),
);

console.log(
  "Different Declared Suits Do Not Prevent Queen Cancellation:",
  areSiegeSpecialsCancelled(queenCancelPlayer, queenCancelOpponent) === true,
);

// --------------------------------------------------
// TEST: Cancelled Queen cannot contribute declared suit
// --------------------------------------------------

const queenCancelNumber = createCard(
  "spades",
  "8",
);

const queenCancelOpponentNumber = createCard(
  "clubs",
  "6",
);

queenCancelPlayer.siege.left.push(
  queenCancelNumber,
);

queenCancelOpponent.siege.left.push(
  queenCancelOpponentNumber,
);

const queenCancelResults =
  resolveSiegeLanes(
    queenCancelPlayer,
    queenCancelOpponent,
  );

console.log(
  "Cancelled Queen Siege Results:",
  queenCancelResults,
);

const cancelledQueenSuit =
  getSweepSpecialSuit(
    queenCancelPlayer,
    queenCancelOpponent,
    queenCancelResults,
    "playerA",
  );

console.log(
  "Cancelled Queen Has No Repetition Suit:",
  cancelledQueenSuit === null,
);

const queenCancelWall = createCard(
  "spades",
  "7",
);

const queenCancelBaseDamage =
  getBaseSiegeDamage(
    queenCancelPlayer,
    queenCancelResults,
    "playerA",
  );

const queenCancelFinalDamage =
  getFinalSiegeDamage(
    queenCancelPlayer,
    queenCancelOpponent,
    queenCancelResults,
    "playerA",
    queenCancelWall,
  );

console.log(
  "Cancelled Queen Base Damage:",
  queenCancelBaseDamage,
);

console.log(
  "Cancelled Queen Final Damage:",
  queenCancelFinalDamage,
);

console.log(
  "Cancelled Queen Does Not Trigger Repetition:",
  queenCancelFinalDamage ===
    queenCancelBaseDamage,
);