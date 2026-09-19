import {
  KING_HP,
  isKing,
  createKingState,
  canReinforceKing,
  reinforceKing,
  getExposedKingLayer,
  applyKingDamage,
  isKingLayerDestroyed,
  destroyKingReinforcement,
  isOriginalKingDefeated,
} from "../systems/kingSystem.js";

import { createCard } from "../systems/cardSystem.js";

import { createPlayer, drawCard } from "../systems/playerSystem.js";

console.log("----- KING SYSTEM TESTS -----");

const testKing = createCard("hearts", "king");

const testNumberCard = createCard("clubs", "7");

console.log("King Identified:", isKing(testKing) === true);

console.log("Number Card Rejected:", isKing(testNumberCard) === false);

console.log("Missing Card Rejected:", isKing(null) === false);

const testKingState = createKingState(testKing);

console.log("King State Uses Correct Card:", testKingState.card === testKing);

console.log("King Base HP Is 15:", testKingState.baseHp === KING_HP);

console.log("King Current HP Is 15:", testKingState.currentHp === KING_HP);

console.log(
  "King Starts Without Reinforcements:",
  testKingState.reinforcements.length === 0,
);

const testReinforcementKing = createCard("spades", "king");

console.log(
  "King Can Reinforce King Layer:",
  canReinforceKing(testKingState, testReinforcementKing) === true,
);

console.log(
  "Number Cannot Reinforce King Layer:",
  canReinforceKing(testKingState, testNumberCard) === false,
);

console.log(
  "Missing King State Cannot Reinforce:",
  canReinforceKing(null, testReinforcementKing) === false,
);

const firstAttachedKing = createCard("diamonds", "king");

const secondAttachedKing = createCard("clubs", "king");

testKingState.reinforcements.push(firstAttachedKing, secondAttachedKing);

console.log(
  "King Layer Has Two Reinforcements:",
  testKingState.reinforcements.length === 2,
);

console.log(
  "Full King Layer Rejects Reinforcement:",
  canReinforceKing(testKingState, testReinforcementKing) === false,
);

const attachmentTestKing = createCard("hearts", "king");

const attachmentTestState = createKingState(attachmentTestKing);

const attachmentReinforcementKing = createCard("spades", "king");

const attachedReinforcement = reinforceKing(
  attachmentTestState,
  attachmentReinforcementKing,
);

console.log(
  "Reinforcement Attached:",
  attachmentTestState.reinforcements.length === 1,
);

console.log(
  "Attached Reinforcement Uses Correct Card:",
  attachedReinforcement.card === attachmentReinforcementKing,
);

console.log(
  "Reinforcement Base HP Is 15:",
  attachedReinforcement.baseHp === KING_HP,
);

console.log(
  "Reinforcement Current HP Is 15:",
  attachedReinforcement.currentHp === KING_HP,
);

const drawTestPlayer = createPlayer("king-draw-test");

const drawTestOriginalKing = createCard("hearts", "king");

drawTestPlayer.kingState = createKingState(drawTestOriginalKing);

const drawnReinforcementKing = createCard("clubs", "king");

const kingDrawPile = [drawnReinforcementKing];

console.log("King Draw Pile Before:", kingDrawPile.length);

console.log("King Special Hand Before:", drawTestPlayer.specialHand.length);

console.log(
  "King Reinforcements Before Draw:",
  drawTestPlayer.kingState.reinforcements.length,
);

drawCard(drawTestPlayer, kingDrawPile);

console.log("Drawn King Removed From Draw Pile:", kingDrawPile.length === 0);

console.log(
  "Drawn King Did Not Enter Special Hand:",
  drawTestPlayer.specialHand.length === 0,
);

console.log(
  "Drawn King Entered King Layer:",
  drawTestPlayer.kingState.reinforcements.length === 1,
);

console.log(
  "Drawn King Is Correct Reinforcement:",
  drawTestPlayer.kingState.reinforcements[0].card === drawnReinforcementKing,
);

console.log(
  "Drawn King Reinforcement Has 15 HP:",
  drawTestPlayer.kingState.reinforcements[0].currentHp === KING_HP,
);

const exposedKingState = createKingState(createCard("hearts", "king"));

const exposedFirstKing = createCard("diamonds", "king");

const exposedSecondKing = createCard("clubs", "king");

reinforceKing(exposedKingState, exposedFirstKing);

reinforceKing(exposedKingState, exposedSecondKing);

console.log(
  "Newest Reinforcement Is Exposed:",
  getExposedKingLayer(exposedKingState).card === exposedSecondKing,
);

exposedKingState.reinforcements.pop();

console.log(
  "Remaining Reinforcement Is Exposed:",
  getExposedKingLayer(exposedKingState).card === exposedFirstKing,
);

exposedKingState.reinforcements.pop();

console.log(
  "Original King Exposed Without Reinforcements:",
  getExposedKingLayer(exposedKingState) === exposedKingState,
);

const damageKingState = createKingState(createCard("hearts", "king"));

const damageFirstKing = createCard("diamonds", "king");

const damageSecondKing = createCard("clubs", "king");

reinforceKing(damageKingState, damageFirstKing);

reinforceKing(damageKingState, damageSecondKing);

applyKingDamage(damageKingState, 6);

console.log(
  "Exposed Reinforcement Reduced To 9 HP:",
  damageKingState.reinforcements[1].currentHp === 9,
);

console.log(
  "Older Reinforcement Remains At 15 HP:",
  damageKingState.reinforcements[0].currentHp === 15,
);

console.log(
  "Original King Remains At 15 HP:",
  damageKingState.currentHp === 15,
);

applyKingDamage(damageKingState, 20);

console.log(
  "Exposed Reinforcement Clamped To 0 HP:",
  damageKingState.reinforcements[1].currentHp === 0,
);

console.log(
  "Excess Damage Did Not Hit Older Reinforcement:",
  damageKingState.reinforcements[0].currentHp === 15,
);

console.log(
  "Excess Damage Did Not Hit Original King:",
  damageKingState.currentHp === 15,
);

const destructionKingState = createKingState(createCard("hearts", "king"));

const destructionReinforcement = reinforceKing(
  destructionKingState,
  createCard("diamonds", "king"),
);

console.log(
  "Healthy King Layer Is Not Destroyed:",
  isKingLayerDestroyed(destructionReinforcement) === false,
);

applyKingDamage(destructionKingState, 15);

console.log(
  "Zero HP King Layer Is Destroyed:",
  isKingLayerDestroyed(destructionReinforcement) === true,
);

const reinforcementDestructionState = createKingState(
  createCard("hearts", "king"),
);

const olderKingReinforcement = reinforceKing(
  reinforcementDestructionState,
  createCard("diamonds", "king"),
);

const newestKingReinforcement = reinforceKing(
  reinforcementDestructionState,
  createCard("clubs", "king"),
);

const removedFromGamePile = [];

applyKingDamage(reinforcementDestructionState, 15);

const destroyedReinforcement = destroyKingReinforcement(
  reinforcementDestructionState,
  removedFromGamePile,
);

console.log(
  "Destroyed Reinforcement Removed:",
  destroyedReinforcement === true,
);

console.log(
  "King Layer Now Has One Reinforcement:",
  reinforcementDestructionState.reinforcements.length === 1,
);

console.log(
  "Older Reinforcement Became Exposed:",
  getExposedKingLayer(reinforcementDestructionState) === olderKingReinforcement,
);

console.log(
  "Destroyed Reinforcement Entered Removed From Game Pile:",
  removedFromGamePile[0] === newestKingReinforcement.card,
);

console.log(
  "Removed From Game Pile Contains One Destroyed King:",
  removedFromGamePile.length === 1,
);

const originalOnlyKingState = createKingState(createCard("spades", "king"));

applyKingDamage(originalOnlyKingState, 15);

const originalDestructionResult = destroyKingReinforcement(
  originalOnlyKingState,
  removedFromGamePile,
);

console.log(
  "Reinforcement Function Cannot Destroy Original King:",
  originalDestructionResult === false,
);

console.log(
  "Original King Did Not Enter Removed From Game Pile:",
  removedFromGamePile.length === 1,
);

const defeatKingState = createKingState(createCard("hearts", "king"));

console.log(
  "Healthy Original King Is Not Defeated:",
  isOriginalKingDefeated(defeatKingState) === false,
);

applyKingDamage(defeatKingState, 15);

console.log(
  "Zero HP Original King Is Defeated:",
  isOriginalKingDefeated(defeatKingState) === true,
);

const protectedKingState = createKingState(createCard("spades", "king"));

reinforceKing(protectedKingState, createCard("clubs", "king"));

applyKingDamage(protectedKingState, 15);

console.log(
  "Destroyed Reinforcement Does Not Defeat Original King:",
  isOriginalKingDefeated(protectedKingState) === false,
);

console.log(
  "Protected Original King Remains At 15 HP:",
  protectedKingState.currentHp === 15,
);

const healthyReinforcementState = createKingState(
  createCard("diamonds", "king"),
);

reinforceKing(healthyReinforcementState, createCard("clubs", "king"));

const healthyRemovedFromGamePile = [];

const healthyReinforcementResult = destroyKingReinforcement(
  healthyReinforcementState,
  healthyRemovedFromGamePile,
);

console.log(
  "Healthy Reinforcement Destruction Rejected:",
  healthyReinforcementResult === false,
);

console.log(
  "Healthy Reinforcement Remains In King Layer:",
  healthyReinforcementState.reinforcements.length === 1,
);

console.log(
  "Healthy Reinforcement Did Not Enter Removed From Game Pile:",
  healthyRemovedFromGamePile.length === 0,
);

console.log(
  "Healthy Reinforcement Remains At 15 HP:",
  getExposedKingLayer(healthyReinforcementState).currentHp === 15,
);
