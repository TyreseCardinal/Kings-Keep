import { createPlayer, drawCard } from "../systems/playerSystem.js";

import { createCard } from "../systems/cardSystem.js";

import {
  PHASES,
  createPhaseState,
  getCombatPhase,
  getLastStandPlayer,
} from "../systems/phaseSystem.js";

import { getActiveDefense } from "../systems/towerSystem.js";

import {
  createKingState,
  reinforceKing,
  applyKingDamage,
  destroyKingReinforcement,
} from "../systems/kingSystem.js";

import { isValidLane, canPlayToSiege } from "../systems/siegeSystem.js";

import { canFortify, fortifyWall } from "../systems/fortificationSystem.js";

import { createWallState } from "../systems/wallSystem.js";

import { canConvert, convertWall } from "../systems/convertSystem.js";

console.log("----- PHASE SYSTEM TESTS -----");

const phaseState = createPhaseState();

console.log(
  "Phase Starts In Normal Siege:",
  phaseState.currentPhase === PHASES.NORMAL_SIEGE,
);

console.log(
  "Normal Siege Constant Exists:",
  PHASES.NORMAL_SIEGE === "normal_siege",
);

console.log("Last Stand Constant Exists:", PHASES.LAST_STAND === "last_stand");

console.log("Endgame Constant Exists:", PHASES.ENDGAME === "endgame");

// ---------------------------------------------
// Combat Phase Detection
// ---------------------------------------------

const normalPlayerA = createPlayer("playerA");
const normalPlayerB = createPlayer("playerB");

normalPlayerA.tower.push(
  createCard("hearts", "7"),
  createCard("clubs", "king"),
);

normalPlayerB.tower.push(
  createCard("spades", "6"),
  createCard("diamonds", "king"),
);

console.log(
  "Both Players With Walls Is Normal Siege:",
  getCombatPhase(normalPlayerA, normalPlayerB) === PHASES.NORMAL_SIEGE,
);

const lastStandPlayerA = createPlayer("playerA");
const lastStandPlayerB = createPlayer("playerB");

lastStandPlayerA.tower.push(createCard("clubs", "king"));

lastStandPlayerB.tower.push(
  createCard("hearts", "8"),
  createCard("spades", "king"),
);

console.log(
  "One Player Without Walls Is Last Stand:",
  getCombatPhase(lastStandPlayerA, lastStandPlayerB) === PHASES.LAST_STAND,
);

const endgamePlayerA = createPlayer("playerA");
const endgamePlayerB = createPlayer("playerB");

endgamePlayerA.tower.push(createCard("hearts", "king"));

endgamePlayerB.tower.push(createCard("spades", "king"));

console.log(
  "Both Players Without Walls Is Endgame:",
  getCombatPhase(endgamePlayerA, endgamePlayerB) === PHASES.ENDGAME,
);

// ---------------------------------------------
// Last Stand Player Detection
// ---------------------------------------------

console.log(
  "Player A Identified As Last Stand Player:",
  getLastStandPlayer(lastStandPlayerA, lastStandPlayerB) === lastStandPlayerA,
);

console.log(
  "Normal Siege Has No Last Stand Player:",
  getLastStandPlayer(normalPlayerA, normalPlayerB) === undefined,
);

console.log(
  "Endgame Has No Last Stand Player:",
  getLastStandPlayer(endgamePlayerA, endgamePlayerB) === undefined,
);

const reverseLastStandPlayerA = createPlayer("playerA");

const reverseLastStandPlayerB = createPlayer("playerB");

reverseLastStandPlayerA.tower.push(
  createCard("hearts", "7"),
  createCard("clubs", "king"),
);

reverseLastStandPlayerB.tower.push(createCard("spades", "king"));

console.log(
  "Player B Identified As Last Stand Player:",
  getLastStandPlayer(reverseLastStandPlayerA, reverseLastStandPlayerB) ===
    reverseLastStandPlayerB,
);

// ---------------------------------------------
// Active Defense
// ---------------------------------------------

const wallDefensePlayer = createPlayer("wallDefensePlayer");

const wallDefenseCard = createCard("hearts", "7");

const wallDefenseKing = createCard("clubs", "king");

wallDefensePlayer.tower.push(wallDefenseCard, wallDefenseKing);

console.log(
  "Active Wall Is Active Defense:",
  getActiveDefense(wallDefensePlayer) === wallDefenseCard,
);

// ---------------------------------------------
// Original King As Active Defense
// ---------------------------------------------

const kingDefensePlayer = createPlayer("kingDefensePlayer");

const kingDefenseCard = createCard("hearts", "king");

kingDefensePlayer.tower.push(kingDefenseCard);

kingDefensePlayer.kingState = createKingState(kingDefenseCard);

console.log(
  "Original King Is Active Defense:",
  getActiveDefense(kingDefensePlayer) === kingDefenseCard,
);

// ---------------------------------------------
// Reinforcement As Active Defense
// ---------------------------------------------

const reinforcementDefensePlayer = createPlayer("reinforcementDefensePlayer");

const reinforcementOriginalKing = createCard("hearts", "king");

const reinforcementKing = createCard("spades", "king");

reinforcementDefensePlayer.tower.push(reinforcementOriginalKing);

reinforcementDefensePlayer.kingState = createKingState(
  reinforcementOriginalKing,
);

reinforceKing(reinforcementDefensePlayer.kingState, reinforcementKing);

console.log(
  "Reinforcement Is Active Defense:",
  getActiveDefense(reinforcementDefensePlayer) === reinforcementKing,
);

// ---------------------------------------------
// Newest Reinforcement As Active Defense
// ---------------------------------------------

const layeredDefensePlayer = createPlayer("layeredDefensePlayer");

const layeredOriginalKing = createCard("hearts", "king");

const olderReinforcement = createCard("clubs", "king");

const newestReinforcement = createCard("spades", "king");

layeredDefensePlayer.tower.push(layeredOriginalKing);

layeredDefensePlayer.kingState = createKingState(layeredOriginalKing);

reinforceKing(layeredDefensePlayer.kingState, olderReinforcement);

reinforceKing(layeredDefensePlayer.kingState, newestReinforcement);

console.log(
  "Newest Reinforcement Is Active Defense:",
  getActiveDefense(layeredDefensePlayer) === newestReinforcement,
);

// ---------------------------------------------
// Active Defense After Reinforcement Destruction
// ---------------------------------------------

const activeDefenseRemovedFromGamePile = [];

applyKingDamage(layeredDefensePlayer.kingState, 15);

destroyKingReinforcement(
  layeredDefensePlayer.kingState,
  activeDefenseRemovedFromGamePile,
);

console.log(
  "Older Reinforcement Becomes Active Defense:",
  getActiveDefense(layeredDefensePlayer) === olderReinforcement,
);

console.log(
  "Destroyed Active Defense Entered Removed From Game Pile:",
  activeDefenseRemovedFromGamePile[0] === newestReinforcement,
);

// ---------------------------------------------
// Phase-Aware Lane Validation
// ---------------------------------------------

const laneTestPlayer = createPlayer("laneTestPlayer");

const laneTestCard = createCard("hearts", "7");

// ---------------------------------------------
// Normal Siege Lanes
// ---------------------------------------------

console.log(
  "Normal Siege Left Lane Valid:",
  isValidLane(laneTestPlayer.siege, "left", PHASES.NORMAL_SIEGE),
);

console.log(
  "Normal Siege Center Lane Valid:",
  isValidLane(laneTestPlayer.siege, "center", PHASES.NORMAL_SIEGE),
);

console.log(
  "Normal Siege Right Lane Valid:",
  isValidLane(laneTestPlayer.siege, "right", PHASES.NORMAL_SIEGE),
);

// ---------------------------------------------
// Last Stand Lanes
// ---------------------------------------------

console.log(
  "Last Stand Left Lane Rejected:",
  !isValidLane(laneTestPlayer.siege, "left", PHASES.LAST_STAND),
);

console.log(
  "Last Stand Center Lane Valid:",
  isValidLane(laneTestPlayer.siege, "center", PHASES.LAST_STAND),
);

console.log(
  "Last Stand Right Lane Rejected:",
  !isValidLane(laneTestPlayer.siege, "right", PHASES.LAST_STAND),
);

// ---------------------------------------------
// Endgame Lanes
// ---------------------------------------------

console.log(
  "Endgame Left Lane Rejected:",
  !isValidLane(laneTestPlayer.siege, "left", PHASES.ENDGAME),
);

console.log(
  "Endgame Center Lane Valid:",
  isValidLane(laneTestPlayer.siege, "center", PHASES.ENDGAME),
);

console.log(
  "Endgame Right Lane Rejected:",
  !isValidLane(laneTestPlayer.siege, "right", PHASES.ENDGAME),
);

// ---------------------------------------------
// Phase-Aware Card Play Validation
// ---------------------------------------------

console.log(
  "Normal Siege Number Can Play Left:",
  canPlayToSiege(laneTestPlayer, laneTestCard, "left", PHASES.NORMAL_SIEGE),
);

console.log(
  "Last Stand Number Rejected From Left:",
  !canPlayToSiege(laneTestPlayer, laneTestCard, "left", PHASES.LAST_STAND),
);

console.log(
  "Last Stand Number Can Play Center:",
  canPlayToSiege(laneTestPlayer, laneTestCard, "center", PHASES.LAST_STAND),
);

console.log(
  "Endgame Number Rejected From Right:",
  !canPlayToSiege(laneTestPlayer, laneTestCard, "right", PHASES.ENDGAME),
);

console.log(
  "Endgame Number Can Play Center:",
  canPlayToSiege(laneTestPlayer, laneTestCard, "center", PHASES.ENDGAME),
);

// ---------------------------------------------
// Special Card Phase Restrictions
// ---------------------------------------------

const phaseAce = createCard("hearts", "ace");

const phaseJack = createCard("clubs", "jack");

const phaseQueen = createCard("spades", "queen");

// ---------------------------------------------
// Normal Siege Specials
// ---------------------------------------------

console.log(
  "Normal Siege Ace Can Play:",
  canPlayToSiege(laneTestPlayer, phaseAce, "center", PHASES.NORMAL_SIEGE),
);

console.log(
  "Normal Siege Jack Can Play:",
  canPlayToSiege(laneTestPlayer, phaseJack, "center", PHASES.NORMAL_SIEGE),
);

console.log(
  "Normal Siege Queen Can Play:",
  canPlayToSiege(laneTestPlayer, phaseQueen, "center", PHASES.NORMAL_SIEGE),
);

// ---------------------------------------------
// Last Stand Specials
// ---------------------------------------------

console.log(
  "Last Stand Ace Rejected:",
  !canPlayToSiege(laneTestPlayer, phaseAce, "center", PHASES.LAST_STAND),
);

console.log(
  "Last Stand Jack Rejected:",
  !canPlayToSiege(laneTestPlayer, phaseJack, "center", PHASES.LAST_STAND),
);

console.log(
  "Last Stand Queen Rejected:",
  !canPlayToSiege(laneTestPlayer, phaseQueen, "center", PHASES.LAST_STAND),
);

// ---------------------------------------------
// Endgame Specials
// ---------------------------------------------

console.log(
  "Endgame Ace Rejected:",
  !canPlayToSiege(laneTestPlayer, phaseAce, "center", PHASES.ENDGAME),
);

console.log(
  "Endgame Jack Rejected:",
  !canPlayToSiege(laneTestPlayer, phaseJack, "center", PHASES.ENDGAME),
);

console.log(
  "Endgame Queen Rejected:",
  !canPlayToSiege(laneTestPlayer, phaseQueen, "center", PHASES.ENDGAME),
);

// ---------------------------------------------
// Phase-Aware Draw Rules
// ---------------------------------------------

// ---------------------------------------------
// Last Stand Special Draw
// ---------------------------------------------

const lastStandDrawPlayer = createPlayer("lastStandDrawPlayer");

const lastStandDrawAce = createCard("hearts", "ace");

const lastStandDrawPile = [lastStandDrawAce];

const lastStandDeadPile = [];

drawCard(
  lastStandDrawPlayer,
  lastStandDrawPile,
  PHASES.LAST_STAND,
  lastStandDeadPile,
);

console.log(
  "Last Stand Special Removed From Draw Pile:",
  lastStandDrawPile.length === 0,
);

console.log(
  "Last Stand Special Entered Dead Pile:",
  lastStandDeadPile[0] === lastStandDrawAce,
);

console.log(
  "Last Stand Special Did Not Enter Special Hand:",
  lastStandDrawPlayer.specialHand.length === 0,
);

// ---------------------------------------------
// Last Stand King Draw
// ---------------------------------------------

const lastStandKingPlayer = createPlayer("lastStandKingPlayer");

const lastStandOriginalKing = createCard("clubs", "king");

const lastStandDrawKing = createCard("spades", "king");

lastStandKingPlayer.tower.push(lastStandOriginalKing);

lastStandKingPlayer.kingState = createKingState(lastStandOriginalKing);

const lastStandKingDrawPile = [lastStandDrawKing];

const lastStandKingDeadPile = [];

drawCard(
  lastStandKingPlayer,
  lastStandKingDrawPile,
  PHASES.LAST_STAND,
  lastStandKingDeadPile,
);

console.log(
  "Last Stand King Entered Dead Pile:",
  lastStandKingDeadPile[0] === lastStandDrawKing,
);

console.log(
  "Last Stand King Did Not Reinforce:",
  lastStandKingPlayer.kingState.reinforcements.length === 0,
);

console.log(
  "Last Stand King Did Not Enter Special Hand:",
  lastStandKingPlayer.specialHand.length === 0,
);

// ---------------------------------------------
// Endgame Special Draw
// ---------------------------------------------

const endgameDrawPlayer = createPlayer("endgameDrawPlayer");

const endgameDrawQueen = createCard("diamonds", "queen");

const endgameDrawPile = [endgameDrawQueen];

const endgameDeadPile = [];

drawCard(endgameDrawPlayer, endgameDrawPile, PHASES.ENDGAME, endgameDeadPile);

console.log(
  "Endgame Special Removed From Draw Pile:",
  endgameDrawPile.length === 0,
);

console.log(
  "Endgame Special Entered Dead Pile:",
  endgameDeadPile[0] === endgameDrawQueen,
);

console.log(
  "Endgame Special Did Not Enter Special Hand:",
  endgameDrawPlayer.specialHand.length === 0,
);

// ---------------------------------------------
// Endgame King Draw
// ---------------------------------------------

const endgameKingPlayer = createPlayer("endgameKingPlayer");

const endgameOriginalKing = createCard("hearts", "king");

const endgameDrawKing = createCard("diamonds", "king");

endgameKingPlayer.tower.push(endgameOriginalKing);

endgameKingPlayer.kingState = createKingState(endgameOriginalKing);

const endgameKingDrawPile = [endgameDrawKing];

const endgameKingDeadPile = [];

drawCard(
  endgameKingPlayer,
  endgameKingDrawPile,
  PHASES.ENDGAME,
  endgameKingDeadPile,
);

console.log(
  "Endgame King Entered Dead Pile:",
  endgameKingDeadPile[0] === endgameDrawKing,
);

console.log(
  "Endgame King Did Not Reinforce:",
  endgameKingPlayer.kingState.reinforcements.length === 0,
);

console.log(
  "Endgame King Did Not Enter Special Hand:",
  endgameKingPlayer.specialHand.length === 0,
);

// ---------------------------------------------
// Number Draw Remains Normal
// ---------------------------------------------

const phaseNumberDrawPlayer = createPlayer("phaseNumberDrawPlayer");

const phaseNumberCard = createCard("clubs", "8");

const phaseNumberDrawPile = [phaseNumberCard];

const phaseNumberDeadPile = [];

drawCard(
  phaseNumberDrawPlayer,
  phaseNumberDrawPile,
  PHASES.LAST_STAND,
  phaseNumberDeadPile,
);

console.log(
  "Last Stand Number Entered Normal Hand:",
  phaseNumberDrawPlayer.hand[0] === phaseNumberCard,
);

console.log(
  "Last Stand Number Did Not Enter Dead Pile:",
  phaseNumberDeadPile.length === 0,
);

// ---------------------------------------------
// Phase-Aware Fortification Rules
// ---------------------------------------------

// ---------------------------------------------
// Normal Siege Fortification
// ---------------------------------------------

const normalFortifyPlayer = createPlayer("normalFortifyPlayer");

const normalFortifyWallCard = createCard("hearts", "7");

const normalFortifyCard = createCard("clubs", "7");

normalFortifyPlayer.tower.push(normalFortifyWallCard);

normalFortifyPlayer.hand.push(normalFortifyCard);

const normalFortifyWall = createWallState(normalFortifyWallCard);

normalFortifyPlayer.activeWallState = normalFortifyWall;

console.log(
  "Normal Siege Can Fortify:",
  canFortify(normalFortifyWall, normalFortifyCard, PHASES.NORMAL_SIEGE),
);

fortifyWall(
  normalFortifyPlayer,
  normalFortifyWall,
  normalFortifyCard,
  PHASES.NORMAL_SIEGE,
);

console.log(
  "Normal Siege Fortification Attached:",
  normalFortifyWall.fortification?.card === normalFortifyCard,
);

console.log(
  "Normal Siege Fortification Increased HP:",
  normalFortifyWall.currentHp === 14,
);

// ---------------------------------------------
// Last Stand Fortification
// ---------------------------------------------

const lastStandFortifyPlayer = createPlayer("lastStandFortifyPlayer");

const lastStandFortifyWallCard = createCard("diamonds", "6");

const lastStandFortifyCard = createCard("clubs", "6");

lastStandFortifyPlayer.tower.push(lastStandFortifyWallCard);

lastStandFortifyPlayer.hand.push(lastStandFortifyCard);

const lastStandFortifyWall = createWallState(lastStandFortifyWallCard);

console.log(
  "Last Stand Fortify Rejected:",
  !canFortify(lastStandFortifyWall, lastStandFortifyCard, PHASES.LAST_STAND),
);

fortifyWall(
  lastStandFortifyPlayer,
  lastStandFortifyWall,
  lastStandFortifyCard,
  PHASES.LAST_STAND,
);

console.log(
  "Last Stand Fortification Not Attached:",
  lastStandFortifyWall.fortification === null,
);

console.log(
  "Last Stand Fortify Preserved HP:",
  lastStandFortifyWall.currentHp === 6,
);

console.log(
  "Last Stand Fortify Preserved Hand:",
  lastStandFortifyPlayer.hand[0] === lastStandFortifyCard,
);

// ---------------------------------------------
// Endgame Fortification
// ---------------------------------------------

const endgameFortifyPlayer = createPlayer("endgameFortifyPlayer");

const endgameFortifyWallCard = createCard("spades", "8");

const endgameFortifyCard = createCard("hearts", "8");

endgameFortifyPlayer.tower.push(endgameFortifyWallCard);

endgameFortifyPlayer.hand.push(endgameFortifyCard);

const endgameFortifyWall = createWallState(endgameFortifyWallCard);

console.log(
  "Endgame Fortify Rejected:",
  !canFortify(endgameFortifyWall, endgameFortifyCard, PHASES.ENDGAME),
);

fortifyWall(
  endgameFortifyPlayer,
  endgameFortifyWall,
  endgameFortifyCard,
  PHASES.ENDGAME,
);

console.log(
  "Endgame Fortification Not Attached:",
  endgameFortifyWall.fortification === null,
);

console.log(
  "Endgame Fortify Preserved HP:",
  endgameFortifyWall.currentHp === 8,
);

console.log(
  "Endgame Fortify Preserved Hand:",
  endgameFortifyPlayer.hand[0] === endgameFortifyCard,
);

// ---------------------------------------------
// Phase-Aware Convert Rules
// ---------------------------------------------

// ---------------------------------------------
// Normal Siege Convert
// ---------------------------------------------

const normalConvertPlayer = createPlayer("normalConvertPlayer");

const normalConvertWallCard = createCard("hearts", "7");

const normalConvertCard = createCard("hearts", "4");

const normalConvertKing = createCard("spades", "king");

normalConvertPlayer.tower.push(normalConvertWallCard, normalConvertKing);

normalConvertPlayer.hand.push(normalConvertCard);

const normalConvertWall = createWallState(normalConvertWallCard);

const normalConvertDeadPile = [];

console.log(
  "Normal Siege Can Convert:",
  canConvert(normalConvertWall, normalConvertCard, PHASES.NORMAL_SIEGE),
);

const normalConvertedWall = convertWall(
  normalConvertPlayer,
  normalConvertWall,
  normalConvertCard,
  normalConvertDeadPile,
  PHASES.NORMAL_SIEGE,
);

console.log(
  "Normal Siege Convert Replaced Active Wall:",
  normalConvertPlayer.tower[0] === normalConvertCard,
);

console.log(
  "Normal Siege Old Wall Entered Dead Pile:",
  normalConvertDeadPile[0] === normalConvertWallCard,
);

console.log(
  "Normal Siege Convert Removed Card From Hand:",
  normalConvertPlayer.hand.length === 0,
);

console.log(
  "Normal Siege Converted Wall Has Fresh HP:",
  normalConvertedWall?.currentHp === 4,
);

// ---------------------------------------------
// Last Stand Convert
// ---------------------------------------------

const lastStandConvertPlayer = createPlayer("lastStandConvertPlayer");

const lastStandConvertWallCard = createCard("clubs", "6");

const lastStandConvertCard = createCard("clubs", "9");

const lastStandConvertKing = createCard("diamonds", "king");

lastStandConvertPlayer.tower.push(
  lastStandConvertWallCard,
  lastStandConvertKing,
);

lastStandConvertPlayer.hand.push(lastStandConvertCard);

const lastStandConvertWall = createWallState(lastStandConvertWallCard);

const lastStandConvertDeadPile = [];

console.log(
  "Last Stand Convert Rejected:",
  !canConvert(lastStandConvertWall, lastStandConvertCard, PHASES.LAST_STAND),
);

const lastStandConvertResult = convertWall(
  lastStandConvertPlayer,
  lastStandConvertWall,
  lastStandConvertCard,
  lastStandConvertDeadPile,
  PHASES.LAST_STAND,
);

console.log(
  "Last Stand Convert Returned Undefined:",
  lastStandConvertResult === undefined,
);

console.log(
  "Last Stand Convert Preserved Active Wall:",
  lastStandConvertPlayer.tower[0] === lastStandConvertWallCard,
);

console.log(
  "Last Stand Convert Preserved Hand:",
  lastStandConvertPlayer.hand[0] === lastStandConvertCard,
);

console.log(
  "Last Stand Convert Preserved Dead Pile:",
  lastStandConvertDeadPile.length === 0,
);

// ---------------------------------------------
// Endgame Convert
// ---------------------------------------------

const endgameConvertPlayer = createPlayer("endgameConvertPlayer");

const endgameConvertWallCard = createCard("spades", "8");

const endgameConvertCard = createCard("spades", "3");

const endgameConvertKing = createCard("hearts", "king");

endgameConvertPlayer.tower.push(endgameConvertWallCard, endgameConvertKing);

endgameConvertPlayer.hand.push(endgameConvertCard);

const endgameConvertWall = createWallState(endgameConvertWallCard);

const endgameConvertDeadPile = [];

console.log(
  "Endgame Convert Rejected:",
  !canConvert(endgameConvertWall, endgameConvertCard, PHASES.ENDGAME),
);

const endgameConvertResult = convertWall(
  endgameConvertPlayer,
  endgameConvertWall,
  endgameConvertCard,
  endgameConvertDeadPile,
  PHASES.ENDGAME,
);

console.log(
  "Endgame Convert Returned Undefined:",
  endgameConvertResult === undefined,
);

console.log(
  "Endgame Convert Preserved Active Wall:",
  endgameConvertPlayer.tower[0] === endgameConvertWallCard,
);

console.log(
  "Endgame Convert Preserved Hand:",
  endgameConvertPlayer.hand[0] === endgameConvertCard,
);

console.log(
  "Endgame Convert Preserved Dead Pile:",
  endgameConvertDeadPile.length === 0,
);
