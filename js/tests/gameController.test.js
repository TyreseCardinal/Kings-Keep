import {
  createGameController,
  syncCombatPhase,
  resolveCurrentSiege,
  refillPlayerHand,
  playCardToSiege,
  fortifyActiveWall,
  convertActiveWall,
  syncSortieState,
} from "../systems/gameController.js";

import { createPlayer } from "../systems/playerSystem.js";

import { createCard } from "../systems/cardSystem.js";

import { createWallState } from "../systems/wallSystem.js";

import { createKingState } from "../systems/kingSystem.js";

// ---------------------------------------------
// GAME CONTROLLER TESTS
// ---------------------------------------------

console.log("----- GAME CONTROLLER TESTS -----");

// ---------------------------------------------
// CREATE TEST PLAYERS
// ---------------------------------------------

const playerA = createPlayer("A");

const playerB = createPlayer("B");

// Tower length > 1 means the player
// still has at least one Wall + King.

playerA.tower = [{ type: "number" }, { rank: "king" }];

playerB.tower = [{ type: "number" }, { rank: "king" }];

const drawPile = [];
const deadPile = [];

// ---------------------------------------------
// CREATE CONTROLLER
// ---------------------------------------------

const game = createGameController(playerA, playerB, drawPile, deadPile);

console.log(
  "Controller Starts In Normal Siege:",
  game.currentPhase === "normal_siege",
);

// ---------------------------------------------
// NORMAL SIEGE → LAST STAND
// ---------------------------------------------

playerA.tower = [{ rank: "king" }];

const lastStandPhase = syncCombatPhase(game);

console.log(
  "Controller Synchronizes To Last Stand:",
  lastStandPhase === "last_stand" && game.currentPhase === "last_stand",
);

// ---------------------------------------------
// LAST STAND → ENDGAME
// ---------------------------------------------

playerB.tower = [{ rank: "king" }];

const endgamePhase = syncCombatPhase(game);

console.log(
  "Controller Synchronizes To Endgame:",
  endgamePhase === "endgame" && game.currentPhase === "endgame",
);

// ---------------------------------------------
// CONTROLLER NORMAL SIEGE RESOLUTION TEST
// ---------------------------------------------

const resolutionPlayerA = createPlayer("controller-resolution-A");

const resolutionPlayerB = createPlayer("controller-resolution-B");

const resolutionDrawPile = [];
const resolutionDeadPile = [];

// ---------------------------------------------
// CREATE FINAL WALLS + KINGS
// ---------------------------------------------

const resolutionAWall = createCard("clubs", "2");

const resolutionAKing = createCard("hearts", "king");

const resolutionBWall = createCard("diamonds", "2");

const resolutionBKing = createCard("spades", "king");

resolutionPlayerA.tower.push(resolutionAWall, resolutionAKing);

resolutionPlayerB.tower.push(resolutionBWall, resolutionBKing);

resolutionPlayerA.activeWallState = createWallState(resolutionAWall);

resolutionPlayerB.activeWallState = createWallState(resolutionBWall);

// ---------------------------------------------
// CREATE WINNING LANES FOR BOTH PLAYERS
// ---------------------------------------------

resolutionPlayerA.siege.left.push(createCard("hearts", "8"));

resolutionPlayerB.siege.center.push(createCard("clubs", "8"));

// ---------------------------------------------
// CREATE CONTROLLER
// ---------------------------------------------

const resolutionGame = createGameController(
  resolutionPlayerA,
  resolutionPlayerB,
  resolutionDrawPile,
  resolutionDeadPile,
);

console.log(
  "Controller Resolution Starts Normal:",
  resolutionGame.currentPhase === "normal_siege",
);

// ---------------------------------------------
// RESOLVE THROUGH CONTROLLER
// ---------------------------------------------

const controllerSiegeResult = resolveCurrentSiege(resolutionGame);

console.log(
  "Controller Delegated Siege Resolution:",
  controllerSiegeResult !== undefined,
);

console.log(
  "Controller Resolution Destroyed Both Walls:",
  resolutionPlayerA.tower.length === 1 && resolutionPlayerB.tower.length === 1,
);

console.log(
  "Controller Synchronized Result To Endgame:",
  resolutionGame.currentPhase === "endgame",
);

console.log(
  "Controller Cleared Player A Siege:",
  resolutionPlayerA.siege.left.length === 0 &&
    resolutionPlayerA.siege.center.length === 0 &&
    resolutionPlayerA.siege.right.length === 0,
);

console.log(
  "Controller Cleared Player B Siege:",
  resolutionPlayerB.siege.left.length === 0 &&
    resolutionPlayerB.siege.center.length === 0 &&
    resolutionPlayerB.siege.right.length === 0,
);

// ---------------------------------------------
// CONTROLLER REFILL TEST
// ---------------------------------------------

const refillPlayerA = createPlayer("refill-player-a");

const refillPlayerB = createPlayer("refill-player-b");

const refillDrawPile = [createCard("hearts", "2"), createCard("clubs", "3")];

const refillDeadPile = [];

refillPlayerA.hand.push(
  createCard("spades", "4"),
  createCard("hearts", "5"),
  createCard("clubs", "6"),
);

const refillGame = createGameController(
  refillPlayerA,
  refillPlayerB,
  refillDrawPile,
  refillDeadPile,
);

refillPlayerHand(refillGame, refillPlayerA);

console.log(
  "Controller Refilled Number Hand To Five:",
  refillPlayerA.hand.length === 5,
);

console.log(
  "Controller Refill Used Game Draw Pile:",
  refillDrawPile.length === 0,
);

// ---------------------------------------------
// CONTROLLER SIEGE PLAY + REFILL TEST
// ---------------------------------------------

const siegeActionPlayerA = createPlayer("siege-action-a");

const siegeActionPlayerB = createPlayer("siege-action-b");

const siegeActionCard = createCard("hearts", "8");

siegeActionPlayerA.hand.push(
  createCard("clubs", "2"),
  createCard("diamonds", "3"),
  createCard("spades", "4"),
  createCard("clubs", "5"),
  siegeActionCard,
);

const siegeActionDrawPile = [createCard("diamonds", "6")];

const siegeActionDeadPile = [];

// Both players need a Wall + King so
// the controller synchronizes to Normal Siege.

siegeActionPlayerA.tower = [
  createCard("hearts", "7"),
  createCard("clubs", "king"),
];

siegeActionPlayerB.tower = [
  createCard("spades", "7"),
  createCard("diamonds", "king"),
];

const siegeActionGame = createGameController(
  siegeActionPlayerA,
  siegeActionPlayerB,
  siegeActionDrawPile,
  siegeActionDeadPile,
);

const siegePlayedCard = playCardToSiege(
  siegeActionGame,
  siegeActionPlayerA,
  siegeActionCard,
  "left",
);

console.log(
  "Controller Played Number To Siege:",
  siegePlayedCard === siegeActionCard &&
    siegeActionPlayerA.siege.left[0] === siegeActionCard,
);

console.log(
  "Controller Refilled After Number Siege Play:",
  siegeActionPlayerA.hand.length === 5,
);

console.log(
  "Controller Automatic Refill Used Draw Pile:",
  siegeActionDrawPile.length === 0,
);

// ---------------------------------------------
// CONTROLLER FORTIFY + REFILL TEST
// ---------------------------------------------

const fortifyActionPlayerA = createPlayer("fortify-action-a");

const fortifyActionPlayerB = createPlayer("fortify-action-b");

const fortifyActionWall = createCard("hearts", "7");

const fortifyActionKing = createCard("clubs", "king");

fortifyActionPlayerA.tower.push(fortifyActionWall, fortifyActionKing);

fortifyActionPlayerB.tower.push(
  createCard("spades", "6"),
  createCard("diamonds", "king"),
);

fortifyActionPlayerA.activeWallState = createWallState(fortifyActionWall);

const fortifyActionCard = createCard("clubs", "7");

fortifyActionPlayerA.hand.push(
  createCard("hearts", "2"),
  createCard("diamonds", "3"),
  createCard("spades", "4"),
  createCard("hearts", "5"),
  fortifyActionCard,
);

const fortifyActionDrawPile = [createCard("diamonds", "6")];

const fortifyActionDeadPile = [];

const fortifyActionGame = createGameController(
  fortifyActionPlayerA,
  fortifyActionPlayerB,
  fortifyActionDrawPile,
  fortifyActionDeadPile,
);

const controllerFortifiedCard = fortifyActiveWall(
  fortifyActionGame,
  fortifyActionPlayerA,
  fortifyActionCard,
);

console.log(
  "Controller Fortified Active Wall:",
  controllerFortifiedCard === fortifyActionCard &&
    fortifyActionPlayerA.activeWallState.fortification.card ===
      fortifyActionCard,
);

console.log(
  "Controller Fortification Increased Wall HP:",
  fortifyActionPlayerA.activeWallState.currentHp === 14,
);

console.log(
  "Controller Refilled After Fortification:",
  fortifyActionPlayerA.hand.length === 5,
);

console.log(
  "Controller Fortification Refill Used Draw Pile:",
  fortifyActionDrawPile.length === 0,
);

// ---------------------------------------------
// CONTROLLER CONVERT + REFILL TEST
// ---------------------------------------------

const convertActionPlayerA = createPlayer("convert-action-a");

const convertActionPlayerB = createPlayer("convert-action-b");

const convertActionWall = createCard("hearts", "7");

convertActionPlayerA.tower.push(convertActionWall, createCard("clubs", "king"));

convertActionPlayerB.tower.push(
  createCard("spades", "6"),
  createCard("diamonds", "king"),
);

convertActionPlayerA.activeWallState = createWallState(convertActionWall);

// Convert requires the same suit as
// the current active Wall.

const convertActionCard = createCard("hearts", "4");

convertActionPlayerA.hand.push(
  createCard("clubs", "2"),
  createCard("diamonds", "3"),
  createCard("spades", "5"),
  createCard("clubs", "6"),
  convertActionCard,
);

const convertActionDrawPile = [createCard("diamonds", "8")];

const convertActionDeadPile = [];

const convertActionGame = createGameController(
  convertActionPlayerA,
  convertActionPlayerB,
  convertActionDrawPile,
  convertActionDeadPile,
);

const controllerConvertedWall = convertActiveWall(
  convertActionGame,
  convertActionPlayerA,
  convertActionCard,
);

console.log(
  "Controller Converted Active Wall:",
  controllerConvertedWall?.card === convertActionCard &&
    convertActionPlayerA.activeWallState.card === convertActionCard,
);

console.log(
  "Controller Convert Sent Old Wall To Dead Pile:",
  convertActionDeadPile.includes(convertActionWall),
);

console.log(
  "Controller Refilled After Convert:",
  convertActionPlayerA.hand.length === 5,
);

console.log(
  "Controller Convert Refill Used Draw Pile:",
  convertActionDrawPile.length === 0,
);

// ---------------------------------------------
// CONTROLLER SORTIE SYNCHRONIZATION TEST
// ---------------------------------------------

const sortieSyncPlayerA = createPlayer("sortie-sync-a");

const sortieSyncPlayerB = createPlayer("sortie-sync-b");

// Player A has only their King remaining,
// so Player A is the Last Stand player.

sortieSyncPlayerA.tower.push(createCard("hearts", "king"));

sortieSyncPlayerB.tower.push(
  createCard("clubs", "7"),
  createCard("spades", "king"),
);

const sortieSyncGame = createGameController(
  sortieSyncPlayerA,
  sortieSyncPlayerB,
  [],
  [],
);

const synchronizedSortie = syncSortieState(sortieSyncGame);

console.log(
  "Controller Sortie Sync Is Last Stand:",
  sortieSyncGame.currentPhase === "last_stand",
);

console.log(
  "Controller Created Sortie State:",
  synchronizedSortie !== undefined &&
    synchronizedSortie !== null &&
    synchronizedSortie.active === true,
);

console.log(
  "Controller Assigned Correct Sortie Player:",
  synchronizedSortie?.eligiblePlayer === sortieSyncPlayerA,
);

console.log(
  "Controller Stored Sortie State:",
  sortieSyncGame.sortieState === synchronizedSortie,
);

// ---------------------------------------------
// AUTOMATIC LAST STAND + SORTIE TRANSITION TEST
// ---------------------------------------------

const transitionPlayerA = createPlayer("transition-a");

const transitionPlayerB = createPlayer("transition-b");

const transitionWallA = createCard("hearts", "9");

const transitionWallB = createCard("clubs", "4");

transitionPlayerA.tower.push(transitionWallA, createCard("spades", "king"));

transitionPlayerB.tower.push(transitionWallB, createCard("diamonds", "king"));

transitionPlayerA.activeWallState = createWallState(transitionWallA);

transitionPlayerB.activeWallState = createWallState(transitionWallB);

// Player A wins Center with enough damage
// to destroy Player B's final Wall.
//
// Player B wins no lanes, so Player A's
// final Wall survives.

transitionPlayerA.siege.center.push(createCard("spades", "8"));

transitionPlayerB.siege.center.push(createCard("hearts", "2"));

const transitionGame = createGameController(
  transitionPlayerA,
  transitionPlayerB,
  [],
  [],
);

console.log(
  "Automatic Transition Starts Normal:",
  transitionGame.currentPhase === "normal_siege",
);

const transitionResult = resolveCurrentSiege(transitionGame);

console.log(
  "Automatic Transition Siege Resolved:",
  transitionResult !== undefined,
);

console.log(
  "Automatic Transition Destroyed Final Wall:",
  transitionPlayerB.tower.length === 1,
);

console.log(
  "Automatic Transition Entered Last Stand:",
  transitionGame.currentPhase === "last_stand",
);

console.log(
  "Automatic Transition Created Sortie:",
  transitionGame.sortieState?.active === true,
);

console.log(
  "Automatic Transition Assigned Sortie To Player B:",
  transitionGame.sortieState?.eligiblePlayer === transitionPlayerB,
);

// ---------------------------------------------
// CONTROLLER PRESERVES SORTIE PROGRESS TEST
// ---------------------------------------------

const preservePlayerA = createPlayer("preserve-a");

const preservePlayerB = createPlayer("preserve-b");

const preserveWallA = createCard("clubs", "9");

const preserveKingA = createCard("hearts", "king");

const preserveKingB = createCard("spades", "king");

preservePlayerA.tower.push(preserveWallA, preserveKingA);

preservePlayerB.tower.push(preserveKingB);

preservePlayerA.kingState = createKingState(preserveKingA);

preservePlayerB.kingState = createKingState(preserveKingB);

preservePlayerA.activeWallState = createWallState(preserveWallA);

const preserveGame = createGameController(
  preservePlayerA,
  preservePlayerB,
  [],
  [],
);

// Synchronize the initial Last Stand state.
// Player B should receive the Sortie.

const originalSortie = syncSortieState(preserveGame);

// Player B wins the Center lane.
// Their winning Number should become
// the first reserved Sortie card.

preservePlayerA.siege.center.push(createCard("diamonds", "2"));

preservePlayerB.siege.center.push(createCard("clubs", "8"));

const preserveResult = resolveCurrentSiege(preserveGame);

console.log("Preserve Sortie Siege Resolved:", preserveResult !== undefined);

console.log(
  "Preserve Sortie Still Last Stand:",
  preserveGame.currentPhase === "last_stand",
);

console.log(
  "Preserve Sortie Kept Same State:",
  preserveGame.sortieState === originalSortie,
);

console.log(
  "Preserve Sortie Has One Progress:",
  preserveGame.sortieState?.cards.length === 1,
);

console.log(
  "Preserve Sortie Remains Active:",
  preserveGame.sortieState?.active === true,
);

console.log(
  "Preserve Sortie Winning Card Reserved:",
  preserveGame.sortieState?.cards[0]?.id === "8-clubs",
);

// ---------------------------------------------
// CONTROLLER SORTIE SUCCESS TO NORMAL TEST
// ---------------------------------------------

const successPlayerA = createPlayer("success-a");

const successPlayerB = createPlayer("success-b");

const successWallA = createCard("clubs", "10");

const successKingA = createCard("hearts", "king");

const successKingB = createCard("spades", "king");

successPlayerA.tower.push(successWallA, successKingA);

successPlayerB.tower.push(successKingB);

successPlayerA.activeWallState = createWallState(successWallA);

successPlayerA.kingState = createKingState(successKingA);

successPlayerB.kingState = createKingState(successKingB);

const successGame = createGameController(
  successPlayerA,
  successPlayerB,
  [],
  [],
);

const successSortie = syncSortieState(successGame);

// Simulate two previous Sortie wins.
// The third win will be resolved through
// the real controller lifecycle.

successSortie.cards.push(
  createCard("diamonds", "3"),
  createCard("hearts", "4"),
);

successPlayerA.siege.center.push(createCard("diamonds", "2"));

successPlayerB.siege.center.push(createCard("clubs", "8"));

console.log(
  "Sortie Success Starts Last Stand:",
  successGame.currentPhase === "last_stand",
);

console.log(
  "Sortie Success Starts At Two Progress:",
  successSortie.cards.length === 2,
);

const successResult = resolveCurrentSiege(successGame);

console.log("Sortie Success Siege Resolved:", successResult !== undefined);

console.log(
  "Sortie Success Rebuilt Three Walls:",
  successPlayerB.tower.length === 4,
);

console.log(
  "Sortie Success Third Win Is Active Wall:",
  successPlayerB.tower[0]?.id === "8-clubs",
);

console.log(
  "Sortie Success Second Win Is Middle Wall:",
  successPlayerB.tower[1]?.id === "4-hearts",
);

console.log(
  "Sortie Success First Win Is Inner Wall:",
  successPlayerB.tower[2]?.id === "3-diamonds",
);

console.log(
  "Sortie Success Returned To Normal:",
  successGame.currentPhase === "normal_siege",
);

console.log(
  "Sortie Success Cleared Controller Sortie:",
  successGame.sortieState === null,
);

console.log(
  "Sortie Success Created Active Wall State:",
  successPlayerB.activeWallState?.card?.id === "8-clubs",
);

// ---------------------------------------------
// CONTROLLER LAST STAND ROLE REVERSAL TEST
// ---------------------------------------------

const reversalPlayerA = createPlayer("reversal-a");

const reversalPlayerB = createPlayer("reversal-b");

const reversalKingA = createCard("hearts", "king");

const reversalWallB = createCard("clubs", "4");

const reversalKingB = createCard("spades", "king");

reversalPlayerA.tower.push(reversalKingA);

reversalPlayerB.tower.push(reversalWallB, reversalKingB);

reversalPlayerA.kingState = createKingState(reversalKingA);

reversalPlayerB.kingState = createKingState(reversalKingB);

reversalPlayerB.activeWallState = createWallState(reversalWallB);

// Leave Player B's final Wall weak enough
// for Player A's third Sortie win to destroy it.

reversalPlayerB.activeWallState.currentHp = 2;

const reversalGame = createGameController(
  reversalPlayerA,
  reversalPlayerB,
  [],
  [],
);

const originalReversalSortie = syncSortieState(reversalGame);

// Player A already has two Sortie wins.

originalReversalSortie.cards.push(
  createCard("diamonds", "3"),
  createCard("hearts", "4"),
);

// Player A wins Center.
// This is both their third Sortie win
// and enough damage to destroy Player B's
// final Wall.

reversalPlayerA.siege.center.push(createCard("clubs", "8"));

reversalPlayerB.siege.center.push(createCard("diamonds", "2"));

console.log(
  "Role Reversal Starts With Player A Sortie:",
  originalReversalSortie?.eligiblePlayer === reversalPlayerA,
);

const reversalResult = resolveCurrentSiege(reversalGame);

console.log("Role Reversal Siege Resolved:", reversalResult !== undefined);

console.log(
  "Role Reversal Rebuilt Player A Walls:",
  reversalPlayerA.tower.length === 4,
);

console.log(
  "Role Reversal Destroyed Player B Final Wall:",
  reversalPlayerB.tower.length === 1,
);

console.log(
  "Role Reversal Remains Last Stand:",
  reversalGame.currentPhase === "last_stand",
);

console.log(
  "Role Reversal Created New Sortie:",
  reversalGame.sortieState !== null &&
    reversalGame.sortieState !== originalReversalSortie,
);

console.log(
  "Role Reversal Assigned Sortie To Player B:",
  reversalGame.sortieState?.eligiblePlayer === reversalPlayerB,
);

console.log(
  "Role Reversal New Sortie Starts Empty:",
  reversalGame.sortieState?.cards.length === 0,
);

console.log(
  "Role Reversal New Sortie Is Active:",
  reversalGame.sortieState?.active === true,
);

// ---------------------------------------------
// CONTROLLER LAST STAND TO ENDGAME TEST
// ---------------------------------------------

const endgamePlayerA = createPlayer("endgame-transition-a");

const endgamePlayerB = createPlayer("endgame-transition-b");

const endgameKingA = createCard("hearts", "king");

const endgameWallB = createCard("clubs", "4");

const endgameKingB = createCard("spades", "king");

endgamePlayerA.tower.push(endgameKingA);

endgamePlayerB.tower.push(endgameWallB, endgameKingB);

endgamePlayerA.kingState = createKingState(endgameKingA);

endgamePlayerB.kingState = createKingState(endgameKingB);

endgamePlayerB.activeWallState = createWallState(endgameWallB);

// Player A begins in Last Stand.

const endgameTransitionGame = createGameController(
  endgamePlayerA,
  endgamePlayerB,
  [],
  [],
);

const endgameTransitionSortie = syncSortieState(endgameTransitionGame);

// Give Player A one existing Sortie win.
// If Endgame begins, this card must be
// cancelled into the Dead Pile.

const reservedSortieCard = createCard("diamonds", "3");

endgameTransitionSortie.cards.push(reservedSortieCard);

// Leave Player B's final Wall at 2 HP.

endgamePlayerB.activeWallState.currentHp = 2;

// Player A wins Center and destroys
// Player B's final Wall, but this is only
// Sortie win 2/3 — no rebuild occurs.

endgamePlayerA.siege.center.push(createCard("clubs", "8"));

endgamePlayerB.siege.center.push(createCard("diamonds", "2"));

console.log(
  "Endgame Transition Starts Last Stand:",
  endgameTransitionGame.currentPhase === "last_stand",
);

console.log(
  "Endgame Transition Starts With Active Sortie:",
  endgameTransitionSortie.active === true,
);

const endgameTransitionResult = resolveCurrentSiege(endgameTransitionGame);

console.log(
  "Endgame Transition Siege Resolved:",
  endgameTransitionResult !== undefined,
);

console.log(
  "Endgame Transition Destroyed Final Wall:",
  endgamePlayerB.tower.length === 1,
);

console.log(
  "Endgame Transition Both Kings Exposed:",
  endgamePlayerA.tower.length === 1 && endgamePlayerB.tower.length === 1,
);

console.log(
  "Endgame Transition Entered Endgame:",
  endgameTransitionGame.currentPhase === "endgame",
);

console.log(
  "Endgame Transition Cancelled Old Sortie:",
  endgameTransitionSortie.active === false,
);

console.log(
  "Endgame Transition Emptied Sortie Reserve:",
  endgameTransitionSortie.cards.length === 0,
);

console.log(
  "Endgame Transition Cleared Controller Sortie:",
  endgameTransitionGame.sortieState === null,
);

console.log(
  "Endgame Transition Reserved Card Entered Dead Pile:",
  endgameTransitionGame.deadPile.some(
    (card) => card.id === reservedSortieCard.id,
  ),
);

// ---------------------------------------------
// CONTROLLER VICTORY + MATCH LOCK TEST
// ---------------------------------------------

const victoryPlayerA = createPlayer("victory-a");

const victoryPlayerB = createPlayer("victory-b");

const victoryKingA = createCard("hearts", "king");

const victoryKingB = createCard("spades", "king");

victoryPlayerA.tower.push(victoryKingA);

victoryPlayerB.tower.push(victoryKingB);

victoryPlayerA.kingState = createKingState(victoryKingA);

victoryPlayerB.kingState = createKingState(victoryKingB);

// Put Player B's Original King within
// lethal range of Player A's Center card.

victoryPlayerB.kingState.currentHp = 5;

const victoryGame = createGameController(
  victoryPlayerA,
  victoryPlayerB,
  [],
  [],
);

victoryPlayerA.siege.center.push(createCard("clubs", "8"));

victoryPlayerB.siege.center.push(createCard("diamonds", "2"));

console.log("Victory Test Starts Active:", victoryGame.status === "active");

console.log(
  "Victory Test Starts In Endgame:",
  victoryGame.currentPhase === "endgame",
);

const victoryResult = resolveCurrentSiege(victoryGame);

console.log("Victory Siege Resolved:", victoryResult !== undefined);

console.log(
  "Victory Defeated Original King:",
  victoryPlayerB.kingState.currentHp === 0,
);

console.log(
  "Victory Controller Stored Winner:",
  victoryGame.winner === victoryPlayerA,
);

console.log(
  "Victory Controller Finished Match:",
  victoryGame.status === "finished",
);

// Attempt another resolution after the
// match has already finished.

const lockedResolution = resolveCurrentSiege(victoryGame);

console.log(
  "Finished Match Rejects Further Resolution:",
  lockedResolution === undefined,
);

console.log(
  "Finished Match Preserves Winner:",
  victoryGame.winner === victoryPlayerA,
);

// ---------------------------------------------
// FINISHED MATCH ACTION LOCK TEST
// ---------------------------------------------

const lockedPlayerA =
  createPlayer("locked-a");

const lockedPlayerB =
  createPlayer("locked-b");

const lockedWallA =
  createCard(
    "hearts",
    "7",
  );

const lockedKingA =
  createCard(
    "clubs",
    "king",
  );

const lockedWallB =
  createCard(
    "diamonds",
    "7",
  );

const lockedKingB =
  createCard(
    "spades",
    "king",
  );

lockedPlayerA.tower.push(
  lockedWallA,
  lockedKingA,
);

lockedPlayerB.tower.push(
  lockedWallB,
  lockedKingB,
);

lockedPlayerA.activeWallState =
  createWallState(
    lockedWallA,
  );

lockedPlayerB.activeWallState =
  createWallState(
    lockedWallB,
  );

lockedPlayerA.kingState =
  createKingState(
    lockedKingA,
  );

lockedPlayerB.kingState =
  createKingState(
    lockedKingB,
  );

const lockedSiegeCard =
  createCard(
    "clubs",
    "5",
  );

const lockedFortifyCard =
  createCard(
    "hearts",
    "4",
  );

const lockedConvertCard =
  createCard(
    "hearts",
    "6",
  );

lockedPlayerA.hand.push(
  lockedSiegeCard,
  lockedFortifyCard,
  lockedConvertCard,
);

const lockedGame =
  createGameController(
    lockedPlayerA,
    lockedPlayerB,
    [],
    [],
  );

// Simulate a match that has already
// been completed by the controller.

lockedGame.status =
  "finished";

lockedGame.winner =
  lockedPlayerA;

const lockedHandSize =
  lockedPlayerA.hand.length;

const lockedWallHp =
  lockedPlayerA.activeWallState
    .currentHp;

const lockedTowerCard =
  lockedPlayerA.tower[0];

const lockedSiegePlay =
  playCardToSiege(
    lockedGame,
    lockedPlayerA,
    lockedSiegeCard,
    "center",
  );

const lockedFortify =
  fortifyActiveWall(
    lockedGame,
    lockedPlayerA,
    lockedFortifyCard,
  );

const lockedConvert =
  convertActiveWall(
    lockedGame,
    lockedPlayerA,
    lockedConvertCard,
  );

console.log(
  "Finished Match Rejects Siege Play:",
  lockedSiegePlay === undefined,
);

console.log(
  "Finished Match Rejects Fortify:",
  lockedFortify === undefined,
);

console.log(
  "Finished Match Rejects Convert:",
  lockedConvert === undefined,
);

console.log(
  "Finished Match Preserves Hand:",
  lockedPlayerA.hand.length ===
    lockedHandSize,
);

console.log(
  "Finished Match Preserves Wall HP:",
  lockedPlayerA.activeWallState
    .currentHp === lockedWallHp,
);

console.log(
  "Finished Match Preserves Active Wall:",
  lockedPlayerA.tower[0] ===
    lockedTowerCard,
);

console.log(
  "Finished Match Keeps Siege Empty:",
  lockedPlayerA.siege.center
    .length === 0,
);

console.log(
  "Finished Match Preserves Winner:",
  lockedGame.winner ===
    lockedPlayerA,
);