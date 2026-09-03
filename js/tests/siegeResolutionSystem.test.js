import { createCard } from "../systems/cardSystem.js";
import { createPlayer } from "../systems/playerSystem.js";

import { createWallState } from "../systems/wallSystem.js";

import { resolveSiegeAgainstWall } from "../systems/siegeResolutionSystem.js";

// --------------------------------------------------
// TEST: Ace destroys the first wall, then Siege damage
// destroys the newly exposed wall, but does not carry
// into a third wall.
// --------------------------------------------------

const playerA = createPlayer("playerA");
const playerB = createPlayer("playerB");

const deadPile = [];

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

const firstWallCard = createCard("hearts", "7");
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
  "Damage Calculated Against Original Hearts Wall:",
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
