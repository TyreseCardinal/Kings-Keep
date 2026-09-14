import { createCard } from "../systems/cardSystem.js";

import { createPlayer } from "../systems/playerSystem.js";

import {
  createWallState,
} from "../systems/wallSystem.js";

import {
  createSortieState,
  getSortieProgress,
  recordSortieWin,
} from "../systems/sortieSystem.js";

import {
  resolveSiegeAgainstWall,
  resolveLastStandSortieResult,
  resolveSiegeAgainstKing,
  resolveLastStandSiege,
} from "../systems/siegeResolutionSystem.js";

import {
  getCombatPhase,
  getLastStandPlayer,
  PHASES,
} from "../systems/phaseSystem.js";

import {
  fortifyWall,
} from "../systems/fortificationSystem.js";

import {
  createSiege,
  setSiegeSpecialState,
  resolveSiegeLanes,
  getFinalSiegeDamage,
} from "../systems/siegeSystem.js";

import {
  createKingState,
  reinforceKing,
  getExposedKingLayer,
} from "../systems/kingSystem.js";

import {
  getActiveDefense,
} from "../systems/towerSystem.js";

import {
  JACK_MODES,
  createJackState,
} from "../systems/specialCards/jack/jackSystem.js";

// --------------------------------------------------
// TEST: Ace destroys the first wall, then Siege damage
// destroys the newly exposed wall, but does not carry
// into a third wall.
// --------------------------------------------------

const playerA = createPlayer("playerA");
const playerB = createPlayer("playerB");

const deadPile = [];

const playerAActiveWall = createCard("hearts", "6");
const playerAKing = createCard("spades", "king");

playerA.tower.push(
  playerAActiveWall,
  playerAKing,
);

const tenHearts = createCard("hearts", "10");
const aceHearts = createCard("hearts", "ace");
const nineHearts = createCard("hearts", "9");

playerA.siege.left.push(tenHearts);
playerA.siege.center.push(aceHearts);
playerA.siege.right.push(nineHearts);

const fiveClubs = createCard("clubs", "5");
const fourDiamonds = createCard("diamonds", "4");

playerB.siege.left.push(fiveClubs);
playerB.siege.right.push(fourDiamonds);

const firstWallCard = createCard("diamonds", "7");
const secondWallCard = createCard("clubs", "4");
const thirdWallCard = createCard("spades", "8");
const kingCard = createCard("diamonds", "king");

playerB.tower.push(firstWallCard, secondWallCard, thirdWallCard, kingCard);

const firstWallState = createWallState(firstWallCard);

console.log("Tower Before Resolution:", playerB.tower.length);

console.log("Dead Pile Before Resolution:", deadPile.length);

const result = resolveSiegeAgainstWall(
  playerA,
  playerB,
  firstWallState,
  deadPile,
  "playerA",
);

console.log("Siege Resolution Results:", result.siegeResults);

console.log("Final Siege Damage:", result.finalDamage);

console.log(
  "Damage Repeated From Player A Own Active Wall:",
  result.finalDamage === 38,
);

console.log("First Wall Destroyed By Ace:", deadPile.includes(firstWallCard));

console.log(
  "Second Wall Destroyed By Siege Damage:",
  deadPile.includes(secondWallCard),
);

console.log("Exactly Two Walls Destroyed:", deadPile.length === 2);

console.log("Third Wall Is Now Active:", playerB.tower[0] === thirdWallCard);

console.log(
  "Third Wall Was Not Damaged:",
  result.finalWallState?.card === thirdWallCard &&
    result.finalWallState.currentHp === 8,
);

console.log("Tower Length After Resolution:", playerB.tower.length);

console.log("Tower Advanced Exactly Two Layers:", playerB.tower.length === 2);

console.log(
  "Final Wall State Is Third Wall:",
  result.finalWallState?.card === thirdWallCard,
);

// --------------------------------------------------
// TEST: Ace destroys the first wall, but Siege damage
// does not destroy the newly exposed second wall.
// --------------------------------------------------

const partialPlayerA = createPlayer("playerA");
const partialPlayerB = createPlayer("playerB");

const partialDeadPile = [];

const partialPlayerAActiveWall = createCard(
  "hearts",
  "8",
);

const partialPlayerAKing = createCard(
  "clubs",
  "king",
);

partialPlayerA.tower.push(
  partialPlayerAActiveWall,
  partialPlayerAKing,
);

const sixHearts = createCard("hearts", "6");
const partialAceHearts = createCard("hearts", "ace");
const partialFiveClubs = createCard("clubs", "5");

partialPlayerA.siege.left.push(sixHearts);
partialPlayerA.siege.center.push(partialAceHearts);

partialPlayerB.siege.left.push(partialFiveClubs);

const partialFirstWallCard = createCard("hearts", "7");
const partialSecondWallCard = createCard("spades", "10");
const partialKingCard = createCard("diamonds", "king");

partialPlayerB.tower.push(
  partialFirstWallCard,
  partialSecondWallCard,
  partialKingCard,
);

const partialFirstWallState = createWallState(partialFirstWallCard);

partialSecondWallCard.baseValue = 20;

const partialResult = resolveSiegeAgainstWall(
  partialPlayerA,
  partialPlayerB,
  partialFirstWallState,
  partialDeadPile,
  "playerA",
);

console.log("Partial Damage Final Siege Damage:", partialResult.finalDamage);

console.log(
  "Partial Damage Calculated Correctly:",
  partialResult.finalDamage === 12,
);

console.log(
  "Partial Damage First Wall Destroyed By Ace:",
  partialDeadPile.includes(partialFirstWallCard),
);

console.log(
  "Partial Damage Second Wall Survived:",
  !partialDeadPile.includes(partialSecondWallCard),
);

console.log(
  "Partial Damage Second Wall Still Active:",
  partialPlayerB.tower[0] === partialSecondWallCard,
);

console.log(
  "Partial Damage Second Wall HP:",
  partialResult.finalWallState?.currentHp,
);

console.log(
  "Partial Damage Reduced Second Wall To 8 HP:",
  partialResult.finalWallState?.currentHp === 8,
);

console.log(
  "Partial Damage Only One Wall Destroyed:",
  partialDeadPile.length === 1,
);

// --------------------------------------------------
// TEST: Ace destroys the final Wall and exposes King.
// Remaining Siege damage must not be applied as Wall
// damage after the King becomes active.
// --------------------------------------------------

const kingPlayerA = createPlayer("playerA");
const kingPlayerB = createPlayer("playerB");

const kingDeadPile = [];

const kingPlayerAActiveWall = createCard(
  "hearts",
  "8",
);

const kingPlayerAKing = createCard(
  "clubs",
  "king",
);

kingPlayerA.tower.push(
  kingPlayerAActiveWall,
  kingPlayerAKing,
);

const kingTenHearts = createCard("hearts", "10");
const kingAceHearts = createCard("hearts", "ace");
const kingFiveClubs = createCard("clubs", "5");

kingPlayerA.siege.left.push(kingTenHearts);
kingPlayerA.siege.center.push(kingAceHearts);

kingPlayerB.siege.left.push(kingFiveClubs);

const finalWallCard = createCard("hearts", "7");
const exposedKingCard = createCard("diamonds", "king");

kingPlayerB.tower.push(finalWallCard, exposedKingCard);

const finalWallState = createWallState(finalWallCard);

console.log("King Boundary Tower Before:", kingPlayerB.tower.length);

const kingBoundaryResult = resolveSiegeAgainstWall(
  kingPlayerA,
  kingPlayerB,
  finalWallState,
  kingDeadPile,
  "playerA",
);

console.log(
  "King Boundary Final Wall Destroyed:",
  kingDeadPile.includes(finalWallCard),
);

console.log(
  "King Boundary King Became Active:",
  kingPlayerB.tower[0] === exposedKingCard,
);

console.log(
  "King Boundary Final Wall State Is Undefined:",
  kingBoundaryResult.finalWallState === undefined,
);

console.log(
  "King Boundary Tower Contains Only King:",
  kingPlayerB.tower.length === 1,
);

// --------------------------------------------------
// TEST: Siege resolver applies Disruption Jack
// before numbered Wall damage
// --------------------------------------------------

const jackResolverNumber = createCard(
  "clubs",
  "5",
);

const jackResolverJack = createCard(
  "hearts",
  "jack",
);

const jackResolverOpponentNumber = createCard(
  "diamonds",
  "3",
);

const jackResolverWallCard = createCard(
  "spades",
  "7",
);

const jackResolverFortificationCard = createCard(
  "clubs",
  "7",
);

const jackResolverKing = createCard(
  "hearts",
  "king",
);

const jackResolverPlayerActiveWall = createCard(
  "clubs",
  "6",
);

const jackResolverPlayerKing = createCard(
  "diamonds",
  "king",
);

const jackResolverPlayer = {
  siege: createSiege(),
  tower: [
    jackResolverPlayerActiveWall,
    jackResolverPlayerKing,
  ],
};

const jackResolverOpponent = {
  siege: createSiege(),
  tower: [
    jackResolverWallCard,
    jackResolverKing,
  ],
};

jackResolverPlayer.siege.left.push(
  jackResolverNumber,
);

jackResolverPlayer.siege.center.push(
  jackResolverJack,
);

jackResolverOpponent.siege.left.push(
  jackResolverOpponentNumber,
);

const jackResolverState = createJackState(
  jackResolverJack,
  JACK_MODES.DISRUPTION,
);

setSiegeSpecialState(
  jackResolverPlayer.siege,
  jackResolverState,
);

const jackResolverWall = createWallState(
  jackResolverWallCard,
);

const jackResolverDefender = {
  hand: [
    jackResolverFortificationCard,
  ],
};

const jackResolverDeadPile = [];

fortifyWall(
  jackResolverDefender,
  jackResolverWall,
  jackResolverFortificationCard,
);

console.log(
  "Jack Resolver Starting Wall HP:",
  jackResolverWall.currentHp,
);

console.log(
  "Jack Resolver Starts Fortified:",
  jackResolverWall.fortification !== null,
);

const jackResolverResult =
  resolveSiegeAgainstWall(
    jackResolverPlayer,
    jackResolverOpponent,
    jackResolverWall,
    jackResolverDeadPile,
    "playerA",
  );

console.log(
  "Jack Resolver Final Damage:",
  jackResolverResult.finalDamage,
);

console.log(
  "Jack Resolver Numbered Damage Is 5:",
  jackResolverResult.finalDamage === 5,
);

console.log(
  "Jack Resolver Fortification Removed:",
  jackResolverWall.fortification === null,
);

console.log(
  "Jack Resolver Fortification Entered Dead Pile:",
  jackResolverDeadPile.includes(
    jackResolverFortificationCard,
  ),
);

console.log(
  "Jack Resolver Wall HP After:",
  jackResolverWall.currentHp,
);

console.log(
  "Jack Resolved Before Damage:",
  jackResolverWall.currentHp === 2,
);

console.log(
  "Jack Resolver Wall Survived:",
  jackResolverResult.finalWallState ===
    jackResolverWall,
);

// ---------------------------------------------
// Suit Repetition Uses Attacker's Own Active Wall
// Opponent's matching Wall must not cause repeat
// ---------------------------------------------

const ownershipPlayerA = createPlayer("playerA");
const ownershipPlayerB = createPlayer("playerB");
const ownershipDeadPile = [];

const ownershipPlayerAWall = createCard(
  "spades",
  "8",
);

const ownershipPlayerAKing = createCard(
  "clubs",
  "king",
);

ownershipPlayerA.tower.push(
  ownershipPlayerAWall,
  ownershipPlayerAKing,
);

const ownershipPlayerBWall = createCard(
  "hearts",
  "10",
);

const ownershipPlayerBKing = createCard(
  "diamonds",
  "king",
);

ownershipPlayerB.tower.push(
  ownershipPlayerBWall,
  ownershipPlayerBKing,
);

const ownershipAttackOne = createCard(
  "hearts",
  "6",
);

const ownershipAttackTwo = createCard(
  "hearts",
  "5",
);

const ownershipDefenseOne = createCard(
  "clubs",
  "2",
);

const ownershipDefenseTwo = createCard(
  "diamonds",
  "3",
);

ownershipPlayerA.siege.left.push(
  ownershipAttackOne,
);

ownershipPlayerA.siege.center.push(
  ownershipAttackTwo,
);

ownershipPlayerB.siege.left.push(
  ownershipDefenseOne,
);

ownershipPlayerB.siege.center.push(
  ownershipDefenseTwo,
);

const ownershipWallState = createWallState(
  ownershipPlayerBWall,
);

const ownershipResult = resolveSiegeAgainstWall(
  ownershipPlayerA,
  ownershipPlayerB,
  ownershipWallState,
  ownershipDeadPile,
  "playerA",
);

console.log(
  "Opponent Matching Wall Does Not Cause Repetition:",
  ownershipResult.finalDamage === 11,
);

// ---------------------------------------------
// King Active Defense Suit Repetition
// ---------------------------------------------

const kingRepetitionPlayer =
  createPlayer("kingRepetitionPlayer");

const kingRepetitionOpponent =
  createPlayer("kingRepetitionOpponent");

const kingRepetitionKing =
  createCard("hearts", "king");

kingRepetitionPlayer.tower.push(
  kingRepetitionKing,
);

kingRepetitionPlayer.kingState =
  createKingState(
    kingRepetitionKing,
  );

const kingRepeatLeft =
  createCard("hearts", "8");

const kingRepeatCenter =
  createCard("hearts", "10");

const opponentLeft =
  createCard("clubs", "2");

const opponentCenter =
  createCard("diamonds", "3");

kingRepetitionPlayer.siege.left.push(
  kingRepeatLeft,
);

kingRepetitionPlayer.siege.center.push(
  kingRepeatCenter,
);

kingRepetitionOpponent.siege.left.push(
  opponentLeft,
);

kingRepetitionOpponent.siege.center.push(
  opponentCenter,
);

const kingRepetitionResults =
  resolveSiegeLanes(
    kingRepetitionPlayer,
    kingRepetitionOpponent,
  );

const kingActiveDefense =
  getActiveDefense(
    kingRepetitionPlayer,
  );

const kingRepetitionDamage =
  getFinalSiegeDamage(
    kingRepetitionPlayer,
    kingRepetitionOpponent,
    kingRepetitionResults,
    "playerA",
    kingActiveDefense,
  );

console.log(
  "King Is Repetition Active Defense:",
  kingActiveDefense === kingRepetitionKing,
);

console.log(
  "Exposed King Suit Causes Repetition:",
  kingRepetitionDamage === 36,
);

// ---------------------------------------------
// LAST STAND SORTIE RESOLUTION INTEGRATION
// ---------------------------------------------

console.log(
  "----- LAST STAND SORTIE RESOLUTION TESTS -----",
);

// ---------------------------------------------
// WIN
// ---------------------------------------------

const sortieWinPlayer =
  createPlayer("sortieWinPlayer");

const sortieWinOpponent =
  createPlayer("sortieWinOpponent");

const sortieWinKing =
  createCard("hearts", "king");

const sortieWinOpponentWall =
  createCard("clubs", "5");

const sortieWinOpponentKing =
  createCard("spades", "king");

sortieWinPlayer.tower.push(
  sortieWinKing,
);

sortieWinOpponent.tower.push(
  sortieWinOpponentWall,
  sortieWinOpponentKing,
);

const sortieWinState =
  createSortieState(
    sortieWinPlayer,
    sortieWinPlayer,
    sortieWinOpponent,
  );

const sortieWinningCard =
  createCard("diamonds", "8");

sortieWinPlayer.siege.center.push(
  sortieWinningCard,
);

const sortieWinResults = {
  left: "tie",
  center: "playerA",
  right: "tie",
};

const sortieWinDeadPile = [];

console.log(
  "Sortie Win Resolves:",
  resolveLastStandSortieResult(
    sortieWinState,
    sortieWinPlayer,
    sortieWinResults,
    "playerA",
    sortieWinDeadPile,
  ),
);

console.log(
  "Sortie Win Adds One Progress:",
  getSortieProgress(
    sortieWinState,
  ) === 1,
);

console.log(
  "Sortie Winning Card Entered Reserve:",
  sortieWinState.cards[0] ===
    sortieWinningCard,
);

console.log(
  "Sortie Winning Card Left Center:",
  sortieWinPlayer.siege.center.length === 0,
);

console.log(
  "Sortie Win Does Not Use Dead Pile:",
  sortieWinDeadPile.length === 0,
);

// ---------------------------------------------
// TIE
// ---------------------------------------------

const sortieTieCard =
  createCard("clubs", "7");

sortieWinPlayer.siege.center.push(
  sortieTieCard,
);

const sortieTieResults = {
  left: "tie",
  center: "tie",
  right: "tie",
};

console.log(
  "Sortie Tie Resolves:",
  resolveLastStandSortieResult(
    sortieWinState,
    sortieWinPlayer,
    sortieTieResults,
    "playerA",
    sortieWinDeadPile,
  ),
);

console.log(
  "Sortie Tie Preserves Progress:",
  getSortieProgress(
    sortieWinState,
  ) === 1,
);

console.log(
  "Sortie Tie Does Not Reserve Tie Card:",
  sortieWinState.cards.includes(
    sortieTieCard,
  ) === false,
);

// Remove the tied card manually because
// Siege cleanup is not integrated here yet.
sortieWinPlayer.siege.center.length = 0;

// ---------------------------------------------
// LOSS
// ---------------------------------------------

const sortieLossCard =
  createCard("spades", "4");

sortieWinPlayer.siege.center.push(
  sortieLossCard,
);

const sortieLossResults = {
  left: "tie",
  center: "playerB",
  right: "tie",
};

console.log(
  "Sortie Loss Resolves:",
  resolveLastStandSortieResult(
    sortieWinState,
    sortieWinPlayer,
    sortieLossResults,
    "playerA",
    sortieWinDeadPile,
  ),
);

console.log(
  "Sortie Loss Resets Progress:",
  getSortieProgress(
    sortieWinState,
  ) === 0,
);

console.log(
  "Sortie Loss Sends Reserved Win To Dead Pile:",
  sortieWinDeadPile.includes(
    sortieWinningCard,
  ),
);

console.log(
  "Sortie Remains Active After Loss:",
  sortieWinState.active === true,
);

// ---------------------------------------------
// THIRD WIN → IMMEDIATE REBUILD
// ---------------------------------------------

const thirdWinPlayer =
  createPlayer("thirdWinPlayer");

const thirdWinOpponent =
  createPlayer("thirdWinOpponent");

const thirdWinKing =
  createCard("hearts", "king");

const thirdWinOpponentWall =
  createCard("clubs", "6");

const thirdWinOpponentKing =
  createCard("diamonds", "king");

thirdWinPlayer.tower.push(
  thirdWinKing,
);

thirdWinOpponent.tower.push(
  thirdWinOpponentWall,
  thirdWinOpponentKing,
);

const thirdWinState =
  createSortieState(
    thirdWinPlayer,
    thirdWinPlayer,
    thirdWinOpponent,
  );

const thirdWinCardOne =
  createCard("clubs", "5");

const thirdWinCardTwo =
  createCard("diamonds", "7");

const thirdWinCardThree =
  createCard("spades", "9");

thirdWinPlayer.siege.center.push(
  thirdWinCardOne,
);

resolveLastStandSortieResult(
  thirdWinState,
  thirdWinPlayer,
  {
    left: "tie",
    center: "playerA",
    right: "tie",
  },
  "playerA",
  [],
);

thirdWinPlayer.siege.center.push(
  thirdWinCardTwo,
);

resolveLastStandSortieResult(
  thirdWinState,
  thirdWinPlayer,
  {
    left: "tie",
    center: "playerA",
    right: "tie",
  },
  "playerA",
  [],
);

console.log(
  "Third-Win Test Starts With Two Progress:",
  getSortieProgress(
    thirdWinState,
  ) === 2,
);

thirdWinPlayer.siege.center.push(
  thirdWinCardThree,
);

const thirdWinDeadPile = [];

console.log(
  "Third Sortie Win Resolves:",
  resolveLastStandSortieResult(
    thirdWinState,
    thirdWinPlayer,
    {
      left: "tie",
      center: "playerA",
      right: "tie",
    },
    "playerA",
    thirdWinDeadPile,
  ),
);

console.log(
  "Third Win Immediately Rebuilt Tower:",
  thirdWinPlayer.tower.length === 4,
);

console.log(
  "Third Win Became Active Wall:",
  thirdWinPlayer.tower[0] ===
    thirdWinCardThree,
);

console.log(
  "Second Win Became Middle Wall:",
  thirdWinPlayer.tower[1] ===
    thirdWinCardTwo,
);

console.log(
  "First Win Became Inner Wall:",
  thirdWinPlayer.tower[2] ===
    thirdWinCardOne,
);

console.log(
  "Original King Preserved After Integrated Rebuild:",
  thirdWinPlayer.tower[3] ===
    thirdWinKing,
);

console.log(
  "Integrated Rebuild Emptied Reserve:",
  thirdWinState.cards.length === 0,
);

console.log(
  "Integrated Rebuild Ended Sortie:",
  thirdWinState.active === false,
);

// ---------------------------------------------
// KING TARGET SIEGE RESOLUTION
// ---------------------------------------------

console.log(
  "----- KING TARGET SIEGE RESOLUTION TESTS -----",
);

// ---------------------------------------------
// NONLETHAL REINFORCEMENT DAMAGE
// ---------------------------------------------

const kingDamageAttacker =
  createPlayer("kingDamageAttacker");

const kingDamageDefender =
  createPlayer("kingDamageDefender");

const kingDamageAttackerKing =
  createCard("hearts", "king");

const kingDamageDefenderKing =
  createCard("clubs", "king");

const kingDamageReinforcement =
  createCard("spades", "king");

kingDamageAttacker.tower.push(
  kingDamageAttackerKing,
);

kingDamageDefender.tower.push(
  kingDamageDefenderKing,
);

kingDamageAttacker.kingState =
  createKingState(
    kingDamageAttackerKing,
  );

kingDamageDefender.kingState =
  createKingState(
    kingDamageDefenderKing,
  );

reinforceKing(
  kingDamageDefender.kingState,
  kingDamageReinforcement,
);

const nonlethalAttack =
  createCard("diamonds", "6");

kingDamageAttacker.siege.center.push(
  nonlethalAttack,
);

const nonlethalOpponentCard =
  createCard("hearts", "3");

kingDamageDefender.siege.center.push(
  nonlethalOpponentCard,
);

const nonlethalDeadPile = [];
const nonlethalRemovedPile = [];

const nonlethalResult =
  resolveSiegeAgainstKing(
    kingDamageAttacker,
    kingDamageDefender,
    nonlethalDeadPile,
    nonlethalRemovedPile,
    "playerA",
  );

console.log(
  "Nonlethal King Siege Resolved:",
  nonlethalResult !== undefined,
);

console.log(
  "Nonlethal King Siege Damage Is 6:",
  nonlethalResult.finalDamage === 6,
);

console.log(
  "Reinforcement Reduced To 9 HP:",
  getExposedKingLayer(
    kingDamageDefender.kingState,
  ).currentHp === 9,
);

console.log(
  "Nonlethal Reinforcement Not Destroyed:",
  nonlethalResult
    .reinforcementDestroyed === false,
);

console.log(
  "Nonlethal Reinforcement Not Removed From Game:",
  nonlethalRemovedPile.length === 0,
);

console.log(
  "Original King Preserved At 15 HP:",
  kingDamageDefender
    .kingState.currentHp === 15,
);

// ---------------------------------------------
// LETHAL REINFORCEMENT DAMAGE
// ---------------------------------------------

const lethalReinforcementAttacker =
  createPlayer(
    "lethalReinforcementAttacker",
  );

const lethalReinforcementDefender =
  createPlayer(
    "lethalReinforcementDefender",
  );

const lethalAttackerKing =
  createCard("diamonds", "king");

const lethalDefenderKing =
  createCard("clubs", "king");

const lethalReinforcement =
  createCard("spades", "king");

lethalReinforcementAttacker.tower.push(
  lethalAttackerKing,
);

lethalReinforcementDefender.tower.push(
  lethalDefenderKing,
);

lethalReinforcementAttacker.kingState =
  createKingState(
    lethalAttackerKing,
  );

lethalReinforcementDefender.kingState =
  createKingState(
    lethalDefenderKing,
  );

reinforceKing(
  lethalReinforcementDefender.kingState,
  lethalReinforcement,
);

// Give the exposed Reinforcement only 4 HP
// so we can prove excess damage does not
// overflow into the Original King.
getExposedKingLayer(
  lethalReinforcementDefender.kingState,
).currentHp = 4;

const lethalReinforcementAttack =
  createCard("hearts", "9");

const lethalReinforcementDefense =
  createCard("clubs", "2");

lethalReinforcementAttacker
  .siege.center.push(
    lethalReinforcementAttack,
  );

lethalReinforcementDefender
  .siege.center.push(
    lethalReinforcementDefense,
  );

const lethalReinforcementDeadPile = [];
const lethalReinforcementRemovedPile = [];

const lethalReinforcementResult =
  resolveSiegeAgainstKing(
    lethalReinforcementAttacker,
    lethalReinforcementDefender,
    lethalReinforcementDeadPile,
    lethalReinforcementRemovedPile,
    "playerA",
  );

console.log(
  "Lethal Reinforcement Siege Resolved:",
  lethalReinforcementResult !==
    undefined,
);

console.log(
  "Lethal Reinforcement Damage Is 9:",
  lethalReinforcementResult
    .finalDamage === 9,
);

console.log(
  "Reinforcement Destroyed:",
  lethalReinforcementResult
    .reinforcementDestroyed === true,
);

console.log(
  "Destroyed Reinforcement Removed From King Layer:",
  lethalReinforcementDefender
    .kingState.reinforcements
    .length === 0,
);

console.log(
  "Destroyed Reinforcement Entered Removed From Game Pile:",
  lethalReinforcementRemovedPile[0] ===
    lethalReinforcement,
);

console.log(
  "Excess Damage Did Not Hit Original King:",
  lethalReinforcementDefender
    .kingState.currentHp === 15,
);

console.log(
  "Original King Became Exposed:",
  getExposedKingLayer(
    lethalReinforcementDefender.kingState,
  ) ===
    lethalReinforcementDefender.kingState,
);

console.log(
  "Destroying Reinforcement Did Not Defeat Original King:",
  lethalReinforcementResult
    .originalKingDefeated === false,
);

// ---------------------------------------------
// LETHAL ORIGINAL KING DAMAGE
// ---------------------------------------------

const lethalKingAttacker =
  createPlayer("lethalKingAttacker");

const lethalKingDefender =
  createPlayer("lethalKingDefender");

const lethalKingAttackerKing =
  createCard("spades", "king");

const lethalOriginalKing =
  createCard("hearts", "king");

lethalKingAttacker.tower.push(
  lethalKingAttackerKing,
);

lethalKingDefender.tower.push(
  lethalOriginalKing,
);

lethalKingAttacker.kingState =
  createKingState(
    lethalKingAttackerKing,
  );

lethalKingDefender.kingState =
  createKingState(
    lethalOriginalKing,
  );

lethalKingDefender.kingState.currentHp = 5;

const lethalKingAttack =
  createCard("clubs", "8");

const lethalKingDefense =
  createCard("diamonds", "3");

lethalKingAttacker.siege.center.push(
  lethalKingAttack,
);

lethalKingDefender.siege.center.push(
  lethalKingDefense,
);

const lethalKingDeadPile = [];
const lethalKingRemovedPile = [];

const lethalKingResult =
  resolveSiegeAgainstKing(
    lethalKingAttacker,
    lethalKingDefender,
    lethalKingDeadPile,
    lethalKingRemovedPile,
    "playerA",
  );

console.log(
  "Original King Siege Resolved:",
  lethalKingResult !== undefined,
);

console.log(
  "Original King Damage Is 8:",
  lethalKingResult.finalDamage === 8,
);

console.log(
  "Original King Reduced To Zero:",
  lethalKingDefender
    .kingState.currentHp === 0,
);

console.log(
  "Original King Defeat Detected:",
  lethalKingResult
    .originalKingDefeated === true,
);

console.log(
  "Original King Not Removed From Game:",
  lethalKingRemovedPile.length === 0,
);

console.log(
  "Original King Card Remains In Tower:",
  lethalKingDefender.tower[0] ===
    lethalOriginalKing,
);

// ---------------------------------------------
// LAST STAND ROLE REVERSAL
// ---------------------------------------------

console.log(
  "----- LAST STAND ROLE REVERSAL TESTS -----",
);

const reversalPlayerA =
  createPlayer("reversalPlayerA");

const reversalPlayerB =
  createPlayer("reversalPlayerB");

const reversalKingA =
  createCard("hearts", "king");

const reversalKingB =
  createCard("clubs", "king");

const reversalFinalWallB =
  createCard("spades", "4");

reversalPlayerA.tower.push(
  reversalKingA,
);

reversalPlayerB.tower.push(
  reversalFinalWallB,
  reversalKingB,
);

reversalPlayerB.activeWallState =
  createWallState(
    reversalFinalWallB,
  );

  reversalPlayerB.activeWallState.currentHp = 2;

reversalPlayerA.kingState =
  createKingState(
    reversalKingA,
  );

reversalPlayerB.kingState =
  createKingState(
    reversalKingB,
  );

const reversalSortie =
  createSortieState(
    reversalPlayerA,
    reversalPlayerA,
    reversalPlayerB,
  );

const reversalWinOne =
  createCard("clubs", "5");

const reversalWinTwo =
  createCard("diamonds", "6");

const reversalWinThree =
  createCard("hearts", "9");

// Build two existing Sortie wins manually
// through the normal Sortie API.
reversalPlayerA.siege.center.push(
  reversalWinOne,
);

recordSortieWin(
  reversalSortie,
  reversalPlayerA,
  reversalWinOne,
);

reversalPlayerA.siege.center.push(
  reversalWinTwo,
);

recordSortieWin(
  reversalSortie,
  reversalPlayerA,
  reversalWinTwo,
);

console.log(
  "Role Reversal Starts In Last Stand:",
  getCombatPhase(
    reversalPlayerA,
    reversalPlayerB,
  ) === PHASES.LAST_STAND,
);

console.log(
  "Player A Starts As Last Stand Player:",
  getLastStandPlayer(
    reversalPlayerA,
    reversalPlayerB,
  ) === reversalPlayerA,
);

console.log(
  "Role Reversal Starts With Two Sortie Wins:",
  reversalSortie.cards.length === 2,
);

// Third Sortie victory.
// 9 beats 3 and also deals enough damage
// to destroy Player B's final 4 HP Wall.
reversalPlayerA.siege.center.push(
  reversalWinThree,
);

const reversalDefenseCard =
  createCard("diamonds", "3");

reversalPlayerB.siege.center.push(
  reversalDefenseCard,
);

const reversalDeadPile = [];
const reversalRemovedPile = [];

  console.log(
  "Role Reversal Final Wall Starts Damaged:",
  reversalPlayerB.activeWallState
    .currentHp === 2,
);

const reversalResult =
  resolveLastStandSiege(
    reversalPlayerA,
    reversalPlayerB,
    reversalSortie,
    reversalDeadPile,
    reversalRemovedPile,
  );

console.log(
  "Role Reversal Siege Resolved:",
  reversalResult !== undefined,
);

console.log(
  "Third Sortie Win Was Center Winner:",
  reversalResult.centerResult ===
    "playerA",
);

console.log(
  "Third Win Rebuilt Player A Walls:",
  reversalPlayerA.tower.length === 4,
);

console.log(
  "Third Win Became Player A Active Wall:",
  reversalPlayerA.tower[0] ===
    reversalWinThree,
);

console.log(
  "Second Win Became Middle Wall:",
  reversalPlayerA.tower[1] ===
    reversalWinTwo,
);

console.log(
  "First Win Became Inner Wall:",
  reversalPlayerA.tower[2] ===
    reversalWinOne,
);

console.log(
  "Player A Original King Preserved:",
  reversalPlayerA.tower[3] ===
    reversalKingA,
);

console.log(
  "Successful Sortie Became Inactive:",
  reversalSortie.active === false,
);

console.log(
  "Successful Sortie Reserve Is Empty:",
  reversalSortie.cards.length === 0,
);

console.log(
  "Player B Final Wall Was Destroyed:",
  reversalPlayerB.tower.length === 1,
);

console.log(
  "Player B King Is Now Exposed:",
  reversalPlayerB.tower[0] ===
    reversalKingB,
);

console.log(
  "Player B Active Wall State Cleared:",
  reversalPlayerB.activeWallState ===
    null,
);

console.log(
  "Resulting Phase Is Still Last Stand:",
  reversalResult.phaseAfterResolution ===
    PHASES.LAST_STAND,
);

console.log(
  "Board State Confirms Last Stand:",
  getCombatPhase(
    reversalPlayerA,
    reversalPlayerB,
  ) === PHASES.LAST_STAND,
);

console.log(
  "Last Stand Role Reversed To Player B:",
  getLastStandPlayer(
    reversalPlayerA,
    reversalPlayerB,
  ) === reversalPlayerB,
);

console.log(
  "Role Reversal Did Not Enter Endgame:",
  reversalResult.phaseAfterResolution !==
    PHASES.ENDGAME,
);

console.log(
  "Successful Sortie Was Not Cancelled:",
  reversalDeadPile.includes(
    reversalWinOne,
  ) === false &&
  reversalDeadPile.includes(
    reversalWinTwo,
  ) === false &&
  reversalDeadPile.includes(
    reversalWinThree,
  ) === false,
);