// IMPORTS

// Player System Imports

import { createPlayer } from "../systems/playerSystem.js";

// Siege System Imports

import {
  isValidLane,
  canPlayToSiege,
  playSiegeCard,
  getLaneAttackValue,
  compareLaneAttack,
  resolveSiegeLanes,
  canActivateSiegeSpecial,
  getSiegeSpecial,
  areSiegeSpecialsCancelled,
  canResolveSiegeSpecial,
  getBaseSiegeDamage,
  getWinningSiegeCards,
  getSuitRepetitionCount,
  getFinalSiegeDamage,
} from "../systems/siegeSystem.js";

// Card System Imports

import { createCard } from "../systems/cardSystem.js";

// TEST SETUP

// Create Test Players

const testPlayerA = createPlayer("test-player-a");

const testPlayerB = createPlayer("test-player-b");

// Create Test Cards

const testNumberCard = createCard("hearts", "7");

const testSpecialCard = createCard("hearts", "ace");

const testPlayableCard = createCard("clubs", "5");

testPlayerA.hand.push(testPlayableCard);

// SIEGE SYSTEM TESTING

// Siege Creation Test

console.log("Player A Siege:", testPlayerA.siege);

console.log("Player B Siege:", testPlayerB.siege);

console.log("Player A Left Lane:", testPlayerA.siege.left);

console.log("Player A Center Lane:", testPlayerA.siege.center);

console.log("Player A Right Lane:", testPlayerA.siege.right);

console.log(
  "Players Have Separate Sieges:",
  testPlayerA.siege !== testPlayerB.siege,
);

console.log(
  "Players Have Separate Left Lanes:",
  testPlayerA.siege.left !== testPlayerB.siege.left,
);

// Siege Lane Validation Test

console.log("Left Lane Valid:", isValidLane(testPlayerA.siege, "left"));

console.log("Center Lane Valid:", isValidLane(testPlayerA.siege, "center"));

console.log("Right Lane Valid:", isValidLane(testPlayerA.siege, "right"));

console.log(
  "Invalid Lane Rejected:",
  !isValidLane(testPlayerA.siege, "banana"),
);

// Siege Card Validation Test

console.log(
  "Number Card Can Play To Left:",
  canPlayToSiege(testPlayerA, testNumberCard, "left"),
);

console.log(
  "Special Card Rejected:",
  !canPlayToSiege(testPlayerA, testSpecialCard, "left"),
);

console.log(
  "Invalid Lane Rejected For Card:",
  !canPlayToSiege(testPlayerA, testNumberCard, "banana"),
);

console.log(
  "Special Card Can Play To Empty Lane:",
  canPlayToSiege(testPlayerA, testSpecialCard, "left"),
);

// Siege Card Placement Test

console.log("Hand Before Siege Play:", testPlayerA.hand.length);

console.log("Left Lane Before Siege Play:", testPlayerA.siege.left.length);

playSiegeCard(testPlayerA, testPlayableCard, "left");

console.log("Hand After Siege Play:", testPlayerA.hand.length);

console.log("Left Lane After Siege Play:", testPlayerA.siege.left.length);

console.log(
  "Card Moved To Left Lane:",
  testPlayerA.siege.left[0].id === testPlayableCard.id,
);

// Invalid Siege Card Placement Tests

const unownedCard = createCard("diamonds", "8");

const specialCardInHand = createCard("clubs", "ace");

const invalidLaneCard = createCard("spades", "9");

testPlayerA.hand.push(specialCardInHand, invalidLaneCard);

const handBeforeInvalidPlays = testPlayerA.hand.length;

const leftLaneBeforeInvalidPlays = testPlayerA.siege.left.length;

// Unowned Card Test

playSiegeCard(testPlayerA, unownedCard, "left");

console.log(
  "Unowned Card Rejected:",
  testPlayerA.hand.length === handBeforeInvalidPlays &&
    testPlayerA.siege.left.length === leftLaneBeforeInvalidPlays,
);

// Special Card Test

playSiegeCard(testPlayerA, specialCardInHand, "left");

console.log(
  "Special Play Rejected:",
  testPlayerA.hand.includes(specialCardInHand) &&
    testPlayerA.siege.left.length === leftLaneBeforeInvalidPlays,
);

// Invalid Lane Test

playSiegeCard(testPlayerA, invalidLaneCard, "banana");

console.log(
  "Invalid Lane Play Rejected:",
  testPlayerA.hand.includes(invalidLaneCard) &&
    testPlayerA.siege.left.length === leftLaneBeforeInvalidPlays,
);

// Occupied Lane Rejection Test

const occupiedLanePlayer = createPlayer("occupied-lane-player");

const occupiedLaneCardOne = createCard("hearts", "2");

const occupiedLaneCardTwo = createCard("diamonds", "4");

occupiedLanePlayer.hand.push(occupiedLaneCardOne, occupiedLaneCardTwo);

playSiegeCard(occupiedLanePlayer, occupiedLaneCardOne, "left");

console.log(
  "First Card Played To Lane:",
  occupiedLanePlayer.siege.left.length === 1 &&
    occupiedLanePlayer.siege.left[0].id === occupiedLaneCardOne.id,
);

playSiegeCard(occupiedLanePlayer, occupiedLaneCardTwo, "left");

console.log(
  "Second Card Rejected From Occupied Lane:",
  occupiedLanePlayer.hand.includes(occupiedLaneCardTwo),
);

console.log(
  "Lane Still Contains One Card:",
  occupiedLanePlayer.siege.left.length === 1,
);

console.log(
  "Rejected Card Still In Hand:",
  occupiedLanePlayer.hand.includes(occupiedLaneCardTwo),
);

// Multiple Lane Distribution Test

const distributionPlayer = createPlayer("distribution-player");

const leftDistributionCard = createCard("clubs", "2");

const centerDistributionCard = createCard("diamonds", "3");

const rightDistributionCard = createCard("hearts", "4");

distributionPlayer.hand.push(
  leftDistributionCard,
  centerDistributionCard,
  rightDistributionCard,
);

console.log("Distribution Hand Before Plays:", distributionPlayer.hand.length);

playSiegeCard(distributionPlayer, leftDistributionCard, "left");

playSiegeCard(distributionPlayer, centerDistributionCard, "center");

playSiegeCard(distributionPlayer, rightDistributionCard, "right");

console.log("Distribution Hand After Plays:", distributionPlayer.hand.length);

console.log(
  "Left Lane Has Distribution Card:",
  distributionPlayer.siege.left.includes(leftDistributionCard),
);

console.log(
  "Center Lane Has Distribution Card:",
  distributionPlayer.siege.center.includes(centerDistributionCard),
);

console.log(
  "Right Lane Has Distribution Card:",
  distributionPlayer.siege.right.includes(rightDistributionCard),
);

console.log(
  "Cards Distributed Across All Lanes:",
  distributionPlayer.siege.left.includes(leftDistributionCard) &&
    distributionPlayer.siege.center.includes(centerDistributionCard) &&
    distributionPlayer.siege.right.includes(rightDistributionCard),
);

// Siege Lane Attack Value Test

const attackTestPlayer = createPlayer("attack-test-player");

const attackCard = createCard("spades", "8");

attackTestPlayer.hand.push(attackCard);

playSiegeCard(attackTestPlayer, attackCard, "center");

console.log(
  "Center Lane Attack Value:",
  getLaneAttackValue(attackTestPlayer.siege.center),
);

console.log(
  "Lane Attack Value Correct:",
  getLaneAttackValue(attackTestPlayer.siege.center) === 8,
);

console.log(
  "Empty Lane Attack Value:",
  getLaneAttackValue(attackTestPlayer.siege.left),
);

// Lane Attack Comparison Test

const comparisonPlayerA = createPlayer("comparison-player-a");

const comparisonPlayerB = createPlayer("comparison-player-b");

const playerACard = createCard("hearts", "9");

const playerBCard = createCard("spades", "7");

comparisonPlayerA.hand.push(playerACard);

comparisonPlayerB.hand.push(playerBCard);

playSiegeCard(comparisonPlayerA, playerACard, "left");

playSiegeCard(comparisonPlayerB, playerBCard, "left");

console.log(
  "Player A Left Attack:",
  getLaneAttackValue(comparisonPlayerA.siege.left),
);

console.log(
  "Player B Left Attack:",
  getLaneAttackValue(comparisonPlayerB.siege.left),
);

console.log(
  "Left Lane Winner:",
  compareLaneAttack(comparisonPlayerA.siege.left, comparisonPlayerB.siege.left),
);

// Player B Lane Win Test

const playerBWinPlayerA = createPlayer("player-b-win-a");

const playerBWinPlayerB = createPlayer("player-b-win-b");

const playerBWinACard = createCard("hearts", "3");

const playerBWinBCard = createCard("spades", "9");

playerBWinPlayerA.hand.push(playerBWinACard);

playerBWinPlayerB.hand.push(playerBWinBCard);

playSiegeCard(playerBWinPlayerA, playerBWinACard, "center");

playSiegeCard(playerBWinPlayerB, playerBWinBCard, "center");

console.log(
  "Center Lane Winner Is Player B:",
  compareLaneAttack(
    playerBWinPlayerA.siege.center,
    playerBWinPlayerB.siege.center,
  ) === "playerB",
);

// Lane Tie Test

const tiePlayerA = createPlayer("tie-player-a");

const tiePlayerB = createPlayer("tie-player-b");

const tiePlayerACard = createCard("clubs", "6");

const tiePlayerBCard = createCard("diamonds", "6");

tiePlayerA.hand.push(tiePlayerACard);

tiePlayerB.hand.push(tiePlayerBCard);

playSiegeCard(tiePlayerA, tiePlayerACard, "right");

playSiegeCard(tiePlayerB, tiePlayerBCard, "right");

console.log(
  "Right Lane Tie:",
  compareLaneAttack(tiePlayerA.siege.right, tiePlayerB.siege.right) === "tie",
);

// Full Siege Lane Resolution Test

const resolutionPlayerA = createPlayer("resolution-player-a");

const resolutionPlayerB = createPlayer("resolution-player-b");

const resolutionALeft = createCard("hearts", "8");

const resolutionACenter = createCard("clubs", "4");

const resolutionARight = createCard("spades", "6");

const resolutionBLeft = createCard("diamonds", "5");

const resolutionBCenter = createCard("hearts", "9");

const resolutionBRight = createCard("clubs", "6");

resolutionPlayerA.hand.push(
  resolutionALeft,
  resolutionACenter,
  resolutionARight,
);

resolutionPlayerB.hand.push(
  resolutionBLeft,
  resolutionBCenter,
  resolutionBRight,
);

playSiegeCard(resolutionPlayerA, resolutionALeft, "left");

playSiegeCard(resolutionPlayerA, resolutionACenter, "center");

playSiegeCard(resolutionPlayerA, resolutionARight, "right");

playSiegeCard(resolutionPlayerB, resolutionBLeft, "left");

playSiegeCard(resolutionPlayerB, resolutionBCenter, "center");

playSiegeCard(resolutionPlayerB, resolutionBRight, "right");

const siegeResults = resolveSiegeLanes(resolutionPlayerA, resolutionPlayerB);

console.log("Full Siege Results:", siegeResults);

console.log("Left Resolved To Player A:", siegeResults.left === "playerA");

console.log("Center Resolved To Player B:", siegeResults.center === "playerB");

console.log("Right Resolved To Tie:", siegeResults.right === "tie");

// Special Card Placement Test

const specialTestPlayer = createPlayer("special-test-player");

const firstSpecialCard = createCard("clubs", "ace");

const secondSpecialCard = createCard("hearts", "jack");

specialTestPlayer.specialHand.push(firstSpecialCard, secondSpecialCard);

playSiegeCard(specialTestPlayer, firstSpecialCard, "center");

console.log(
  "First Special Played To Siege:",
  specialTestPlayer.siege.center.length === 1 &&
    specialTestPlayer.siege.center[0].id === firstSpecialCard.id,
);

console.log(
  "First Special Removed From Special Hand:",
  !specialTestPlayer.specialHand.includes(firstSpecialCard),
);

playSiegeCard(specialTestPlayer, secondSpecialCard, "right");

console.log(
  "Second Special Rejected:",
  specialTestPlayer.specialHand.includes(secondSpecialCard),
);

console.log(
  "Only One Special In Siege:",
  specialTestPlayer.siege.center.length === 1 &&
    specialTestPlayer.siege.right.length === 0,
);

// Siege Special Activation Eligibility Test

const activationPlayerA = createPlayer("activation-player-a");

const activationPlayerB = createPlayer("activation-player-b");

const activationNumberCard = createCard("hearts", "8");

const activationSpecialCard = createCard("clubs", "ace");

const activationOpponentLeft = createCard("spades", "5");

const activationOpponentCenter = createCard("diamonds", "9");

activationPlayerA.hand.push(activationNumberCard);

activationPlayerA.specialHand.push(activationSpecialCard);

activationPlayerB.hand.push(activationOpponentLeft, activationOpponentCenter);

playSiegeCard(activationPlayerA, activationNumberCard, "left");

playSiegeCard(activationPlayerA, activationSpecialCard, "center");

playSiegeCard(activationPlayerB, activationOpponentLeft, "left");

playSiegeCard(activationPlayerB, activationOpponentCenter, "center");

const activationResults = resolveSiegeLanes(
  activationPlayerA,
  activationPlayerB,
);

console.log("Special Activation Siege Results:", activationResults);

console.log(
  "Special Activates From Numbered Lane Win:",
  canActivateSiegeSpecial(activationPlayerA, activationResults, "playerA"),
);

// Siege Special Failed Activation Test

const failedActivationPlayerA = createPlayer("failed-activation-player-a");

const failedActivationPlayerB = createPlayer("failed-activation-player-b");

const failedActivationNumberCard = createCard("hearts", "4");

const failedActivationSpecialCard = createCard("clubs", "ace");

const failedActivationOpponentLeft = createCard("spades", "8");

const failedActivationOpponentCenter = createCard("diamonds", "9");

failedActivationPlayerA.hand.push(failedActivationNumberCard);

failedActivationPlayerA.specialHand.push(failedActivationSpecialCard);

failedActivationPlayerB.hand.push(
  failedActivationOpponentLeft,
  failedActivationOpponentCenter,
);

playSiegeCard(failedActivationPlayerA, failedActivationNumberCard, "left");

playSiegeCard(failedActivationPlayerA, failedActivationSpecialCard, "center");

playSiegeCard(failedActivationPlayerB, failedActivationOpponentLeft, "left");

playSiegeCard(
  failedActivationPlayerB,
  failedActivationOpponentCenter,
  "center",
);

const failedActivationResults = resolveSiegeLanes(
  failedActivationPlayerA,
  failedActivationPlayerB,
);

console.log("Failed Special Activation Results:", failedActivationResults);

console.log(
  "Special Rejected Without Numbered Lane Win:",
  !canActivateSiegeSpecial(
    failedActivationPlayerA,
    failedActivationResults,
    "playerA",
  ),
);

// Matching Special Cancellation Test

const cancelPlayerA = createPlayer("cancel-player-a");

const cancelPlayerB = createPlayer("cancel-player-b");

const cancelAceA = createCard("hearts", "ace");

const cancelAceB = createCard("clubs", "ace");

cancelPlayerA.specialHand.push(cancelAceA);

cancelPlayerB.specialHand.push(cancelAceB);

playSiegeCard(cancelPlayerA, cancelAceA, "left");

playSiegeCard(cancelPlayerB, cancelAceB, "right");

console.log("Player A Siege Special:", getSiegeSpecial(cancelPlayerA));

console.log("Player B Siege Special:", getSiegeSpecial(cancelPlayerB));

console.log(
  "Matching Specials Cancel:",
  areSiegeSpecialsCancelled(cancelPlayerA, cancelPlayerB),
);

// Different Special Cancellation Test

const differentSpecialPlayerA = createPlayer("different-special-player-a");

const differentSpecialPlayerB = createPlayer("different-special-player-b");

const differentAce = createCard("hearts", "ace");

const differentJack = createCard("clubs", "jack");

differentSpecialPlayerA.specialHand.push(differentAce);

differentSpecialPlayerB.specialHand.push(differentJack);

playSiegeCard(differentSpecialPlayerA, differentAce, "left");

playSiegeCard(differentSpecialPlayerB, differentJack, "right");

console.log(
  "Different Specials Do Not Cancel:",
  !areSiegeSpecialsCancelled(differentSpecialPlayerA, differentSpecialPlayerB),
);

// Successful Special Resolution Test

const resolveSpecialPlayerA = createPlayer("resolve-special-player-a");

const resolveSpecialPlayerB = createPlayer("resolve-special-player-b");

const resolveSpecialNumberA = createCard("hearts", "9");

const resolveSpecialAceA = createCard("clubs", "ace");

const resolveSpecialNumberB = createCard("spades", "5");

resolveSpecialPlayerA.hand.push(resolveSpecialNumberA);

resolveSpecialPlayerA.specialHand.push(resolveSpecialAceA);

resolveSpecialPlayerB.hand.push(resolveSpecialNumberB);

playSiegeCard(resolveSpecialPlayerA, resolveSpecialNumberA, "left");

playSiegeCard(resolveSpecialPlayerA, resolveSpecialAceA, "center");

playSiegeCard(resolveSpecialPlayerB, resolveSpecialNumberB, "left");

const resolveSpecialResults = resolveSiegeLanes(
  resolveSpecialPlayerA,
  resolveSpecialPlayerB,
);

console.log("Successful Special Resolution Results:", resolveSpecialResults);

console.log(
  "Special Can Resolve:",
  canResolveSiegeSpecial(
    resolveSpecialPlayerA,
    resolveSpecialPlayerB,
    resolveSpecialResults,
    "playerA",
  ),
);

// Cancelled Special Resolution Test

const cancelledResolvePlayerA = createPlayer("cancelled-resolve-player-a");

const cancelledResolvePlayerB = createPlayer("cancelled-resolve-player-b");

const cancelledResolveNumberA = createCard("hearts", "9");

const cancelledResolveNumberB = createCard("spades", "5");

const cancelledResolveAceA = createCard("hearts", "ace");

const cancelledResolveAceB = createCard("clubs", "ace");

cancelledResolvePlayerA.hand.push(cancelledResolveNumberA);

cancelledResolvePlayerA.specialHand.push(cancelledResolveAceA);

cancelledResolvePlayerB.hand.push(cancelledResolveNumberB);

cancelledResolvePlayerB.specialHand.push(cancelledResolveAceB);

playSiegeCard(cancelledResolvePlayerA, cancelledResolveNumberA, "left");

playSiegeCard(cancelledResolvePlayerA, cancelledResolveAceA, "center");

playSiegeCard(cancelledResolvePlayerB, cancelledResolveNumberB, "left");

playSiegeCard(cancelledResolvePlayerB, cancelledResolveAceB, "right");

const cancelledResolveResults = resolveSiegeLanes(
  cancelledResolvePlayerA,
  cancelledResolvePlayerB,
);

console.log("Cancelled Special Resolution Results:", cancelledResolveResults);

console.log(
  "Matching Special Prevents Resolution:",
  !canResolveSiegeSpecial(
    cancelledResolvePlayerA,
    cancelledResolvePlayerB,
    cancelledResolveResults,
    "playerA",
  ),
);

// Base Siege Damage Test

const damagePlayerA = createPlayer("damage-player-a");

const damagePlayerB = createPlayer("damage-player-b");

const damageALeft = createCard("hearts", "9");

const damageACenter = createCard("clubs", "7");

const damageBLeft = createCard("spades", "5");

const damageBCenter = createCard("diamonds", "3");

damagePlayerA.hand.push(damageALeft, damageACenter);

damagePlayerB.hand.push(damageBLeft, damageBCenter);

playSiegeCard(damagePlayerA, damageALeft, "left");

playSiegeCard(damagePlayerA, damageACenter, "center");

playSiegeCard(damagePlayerB, damageBLeft, "left");

playSiegeCard(damagePlayerB, damageBCenter, "center");

const damageResults = resolveSiegeLanes(damagePlayerA, damagePlayerB);

const playerABaseDamage = getBaseSiegeDamage(
  damagePlayerA,
  damageResults,
  "playerA",
);

console.log("Base Damage Siege Results:", damageResults);

console.log("Player A Base Siege Damage:", playerABaseDamage);

console.log("Winning Number Values Summed:", playerABaseDamage === 16);

// Losing And Tied Cards Damage Test

const mixedDamagePlayerA = createPlayer("mixed-damage-player-a");

const mixedDamagePlayerB = createPlayer("mixed-damage-player-b");

const mixedDamageALeft = createCard("hearts", "8");

const mixedDamageACenter = createCard("clubs", "4");

const mixedDamageARight = createCard("diamonds", "6");

const mixedDamageBLeft = createCard("spades", "5");

const mixedDamageBCenter = createCard("hearts", "9");

const mixedDamageBRight = createCard("clubs", "6");

mixedDamagePlayerA.hand.push(
  mixedDamageALeft,
  mixedDamageACenter,
  mixedDamageARight,
);

mixedDamagePlayerB.hand.push(
  mixedDamageBLeft,
  mixedDamageBCenter,
  mixedDamageBRight,
);

playSiegeCard(mixedDamagePlayerA, mixedDamageALeft, "left");

playSiegeCard(mixedDamagePlayerA, mixedDamageACenter, "center");

playSiegeCard(mixedDamagePlayerA, mixedDamageARight, "right");

playSiegeCard(mixedDamagePlayerB, mixedDamageBLeft, "left");

playSiegeCard(mixedDamagePlayerB, mixedDamageBCenter, "center");

playSiegeCard(mixedDamagePlayerB, mixedDamageBRight, "right");

const mixedDamageResults = resolveSiegeLanes(
  mixedDamagePlayerA,
  mixedDamagePlayerB,
);

const mixedPlayerABaseDamage = getBaseSiegeDamage(
  mixedDamagePlayerA,
  mixedDamageResults,
  "playerA",
);

console.log("Mixed Damage Siege Results:", mixedDamageResults);

console.log("Player A Mixed Base Damage:", mixedPlayerABaseDamage);

console.log("Loss And Tie Contribute No Damage:", mixedPlayerABaseDamage === 8);

// Winning Siege Cards Test

const winningCardsPlayerA = createPlayer("winning-cards-player-a");

const winningCardsPlayerB = createPlayer("winning-cards-player-b");

const winningCardsALeft = createCard("hearts", "10");

const winningCardsACenter = createCard("hearts", "8");

const winningCardsARight = createCard("clubs", "4");

const winningCardsBLeft = createCard("spades", "5");

const winningCardsBCenter = createCard("diamonds", "3");

const winningCardsBRight = createCard("spades", "9");

winningCardsPlayerA.hand.push(
  winningCardsALeft,
  winningCardsACenter,
  winningCardsARight,
);

winningCardsPlayerB.hand.push(
  winningCardsBLeft,
  winningCardsBCenter,
  winningCardsBRight,
);

playSiegeCard(winningCardsPlayerA, winningCardsALeft, "left");

playSiegeCard(winningCardsPlayerA, winningCardsACenter, "center");

playSiegeCard(winningCardsPlayerA, winningCardsARight, "right");

playSiegeCard(winningCardsPlayerB, winningCardsBLeft, "left");

playSiegeCard(winningCardsPlayerB, winningCardsBCenter, "center");

playSiegeCard(winningCardsPlayerB, winningCardsBRight, "right");

const winningCardsResults = resolveSiegeLanes(
  winningCardsPlayerA,
  winningCardsPlayerB,
);

const playerAWinningCards = getWinningSiegeCards(
  winningCardsPlayerA,
  winningCardsResults,
  "playerA",
);

console.log("Winning Cards Siege Results:", winningCardsResults);

console.log("Player A Winning Cards:", playerAWinningCards);

console.log(
  "Only Winning Number Cards Returned:",
  playerAWinningCards.length === 2 &&
    playerAWinningCards.includes(winningCardsALeft) &&
    playerAWinningCards.includes(winningCardsACenter) &&
    !playerAWinningCards.includes(winningCardsARight),
);

// Suit Repetition Count Test

const repetitionPlayerA = createPlayer("repetition-player-a");

const repetitionPlayerB = createPlayer("repetition-player-b");

const repetitionALeft = createCard("hearts", "10");

const repetitionACenter = createCard("hearts", "8");

const repetitionBLeft = createCard("clubs", "5");

const repetitionBCenter = createCard("spades", "3");

repetitionPlayerA.hand.push(repetitionALeft, repetitionACenter);

repetitionPlayerB.hand.push(repetitionBLeft, repetitionBCenter);

playSiegeCard(repetitionPlayerA, repetitionALeft, "left");

playSiegeCard(repetitionPlayerA, repetitionACenter, "center");

playSiegeCard(repetitionPlayerB, repetitionBLeft, "left");

playSiegeCard(repetitionPlayerB, repetitionBCenter, "center");

const repetitionResults = resolveSiegeLanes(
  repetitionPlayerA,
  repetitionPlayerB,
);

const repetitionActiveWall = createCard("hearts", "7");

const repetitionCount = getSuitRepetitionCount(
  repetitionPlayerA,
  repetitionResults,
  "playerA",
  repetitionActiveWall,
);

console.log("Suit Repetition Siege Results:", repetitionResults);

console.log("Suit Repetition Count:", repetitionCount);

console.log("Two Winning Hearts Match Active Wall:", repetitionCount === 2);

// Final Siege Damage Test

const finalDamagePlayerA = createPlayer("final-damage-player-a");

const finalDamagePlayerB = createPlayer("final-damage-player-b");

const finalDamageALeft = createCard("hearts", "10");

const finalDamageACenter = createCard("hearts", "8");

const finalDamageBLeft = createCard("clubs", "5");

const finalDamageBCenter = createCard("spades", "3");

finalDamagePlayerA.hand.push(finalDamageALeft, finalDamageACenter);

finalDamagePlayerB.hand.push(finalDamageBLeft, finalDamageBCenter);

playSiegeCard(finalDamagePlayerA, finalDamageALeft, "left");

playSiegeCard(finalDamagePlayerA, finalDamageACenter, "center");

playSiegeCard(finalDamagePlayerB, finalDamageBLeft, "left");

playSiegeCard(finalDamagePlayerB, finalDamageBCenter, "center");

const finalDamageResults = resolveSiegeLanes(
  finalDamagePlayerA,
  finalDamagePlayerB,
);

const finalDamageActiveWall = createCard("hearts", "7");

const finalSiegeDamage = getFinalSiegeDamage(
  finalDamagePlayerA,
  finalDamageResults,
  "playerA",
  finalDamageActiveWall,
);

console.log("Final Damage Siege Results:", finalDamageResults);

console.log("Final Siege Damage:", finalSiegeDamage);

console.log("Suit Repetition Applied To Damage:", finalSiegeDamage === 36);

// Suit Repetition Active Wall Mismatch Test

const mismatchPlayerA = createPlayer("mismatch-player-a");

const mismatchPlayerB = createPlayer("mismatch-player-b");

const mismatchALeft = createCard("hearts", "10");

const mismatchACenter = createCard("hearts", "8");

const mismatchBLeft = createCard("clubs", "5");

const mismatchBCenter = createCard("spades", "3");

mismatchPlayerA.hand.push(mismatchALeft, mismatchACenter);

mismatchPlayerB.hand.push(mismatchBLeft, mismatchBCenter);

playSiegeCard(mismatchPlayerA, mismatchALeft, "left");

playSiegeCard(mismatchPlayerA, mismatchACenter, "center");

playSiegeCard(mismatchPlayerB, mismatchBLeft, "left");

playSiegeCard(mismatchPlayerB, mismatchBCenter, "center");

const mismatchResults = resolveSiegeLanes(mismatchPlayerA, mismatchPlayerB);

// Winning cards are Hearts,
// but the Active Wall is Clubs.
const mismatchActiveWall = createCard("clubs", "7");

const mismatchRepetitionCount = getSuitRepetitionCount(
  mismatchPlayerA,
  mismatchResults,
  "playerA",
  mismatchActiveWall,
);

const mismatchFinalDamage = getFinalSiegeDamage(
  mismatchPlayerA,
  mismatchResults,
  "playerA",
  mismatchActiveWall,
);

console.log("Active Wall Mismatch Repetition Count:", mismatchRepetitionCount);

console.log("Active Wall Mismatch Final Damage:", mismatchFinalDamage);

console.log(
  "Mismatched Active Wall Prevents Repetition:",
  mismatchRepetitionCount === 0 && mismatchFinalDamage === 18,
);
