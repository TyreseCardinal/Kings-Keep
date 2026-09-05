import { createCard } from "../systems/cardSystem.js";

import { createWallState } from "../systems/wallSystem.js";

import { canConvert, convertWall } from "../systems/convertSystem.js";

import { fortifyWall } from "../systems/fortificationSystem.js";

console.log("----- CONVERT SYSTEM TESTS -----");

const activeWallCard = createCard("hearts", "7");

const activeWall = createWallState(activeWallCard);

const matchingNumberCard = createCard("hearts", "4");

const wrongSuitNumberCard = createCard("clubs", "4");

const matchingSuitSpecial = createCard("hearts", "ace");

console.log(
  "Matching Suit Number Can Convert:",
  canConvert(activeWall, matchingNumberCard),
);

console.log(
  "Different Suit Number Cannot Convert:",
  !canConvert(activeWall, wrongSuitNumberCard),
);

console.log(
  "Special Card Cannot Convert:",
  !canConvert(activeWall, matchingSuitSpecial),
);

console.log(
  "Missing Active Wall Cannot Convert:",
  !canConvert(null, matchingNumberCard),
);

console.log("Missing Card Cannot Convert:", !canConvert(activeWall, null));

// --------------------------------------------------
// TEST: Convert replaces an unfortified Active Wall
// --------------------------------------------------

const convertOldWallCard = createCard("hearts", "7");

const convertHiddenWallCard = createCard("clubs", "6");

const convertKing = createCard("spades", "king");

const convertNewWallCard = createCard("hearts", "4");

const convertPlayer = {
  hand: [convertNewWallCard],
  tower: [convertOldWallCard, convertHiddenWallCard, convertKing],
};

const convertDeadPile = [];

const convertOldWallState = createWallState(convertOldWallCard);

console.log("Convert Hand Before:", convertPlayer.hand.length);

console.log(
  "Convert Tower Before:",
  convertPlayer.tower.map((card) => card.id),
);

console.log("Convert Dead Pile Before:", convertDeadPile.length);

const convertedWallState = convertWall(
  convertPlayer,
  convertOldWallState,
  convertNewWallCard,
  convertDeadPile,
);

console.log("Convert Hand After:", convertPlayer.hand.length);

console.log(
  "Convert Tower After:",
  convertPlayer.tower.map((card) => card.id),
);

console.log(
  "Convert Dead Pile After:",
  convertDeadPile.map((card) => card.id),
);

console.log(
  "Converted Card Removed From Hand:",
  convertPlayer.hand.length === 0,
);

console.log(
  "Old Wall Entered Dead Pile:",
  convertDeadPile.includes(convertOldWallCard),
);

console.log(
  "Converted Card Became Active Wall:",
  convertPlayer.tower[0] === convertNewWallCard,
);

console.log(
  "Hidden Wall Remained Behind Active Wall:",
  convertPlayer.tower[1] === convertHiddenWallCard,
);

console.log(
  "King Remained At End Of Tower:",
  convertPlayer.tower[2] === convertKing,
);

console.log(
  "Converted Wall State Uses New Card:",
  convertedWallState?.card === convertNewWallCard,
);

console.log("Converted Wall Base HP Is 4:", convertedWallState?.baseHp === 4);

console.log(
  "Converted Wall Current HP Is 4:",
  convertedWallState?.currentHp === 4,
);

console.log(
  "Converted Wall Has No Fortification:",
  convertedWallState?.fortification === null,
);

// --------------------------------------------------
// TEST: Convert destroys attached Fortification
// --------------------------------------------------

const fortifiedOldWallCard = createCard("diamonds", "7");

const fortifiedHiddenWallCard = createCard("clubs", "5");

const fortifiedKing = createCard("hearts", "king");

const fortificationCard = createCard("spades", "7");

const fortifiedConvertCard = createCard("diamonds", "3");

const fortifiedConvertPlayer = {
  hand: [fortificationCard, fortifiedConvertCard],
  tower: [fortifiedOldWallCard, fortifiedHiddenWallCard, fortifiedKing],
};

const fortifiedConvertDeadPile = [];

const fortifiedOldWallState = createWallState(fortifiedOldWallCard);

fortifyWall(fortifiedConvertPlayer, fortifiedOldWallState, fortificationCard);

console.log("Fortified Convert HP Before:", fortifiedOldWallState.currentHp);

console.log(
  "Fortified Convert Has Fortification Before:",
  fortifiedOldWallState.fortification !== null,
);

console.log(
  "Fortified Convert Hand Before:",
  fortifiedConvertPlayer.hand.map((card) => card.id),
);

const fortifiedConvertedWallState = convertWall(
  fortifiedConvertPlayer,
  fortifiedOldWallState,
  fortifiedConvertCard,
  fortifiedConvertDeadPile,
);

console.log(
  "Fortified Convert Dead Pile:",
  fortifiedConvertDeadPile.map((card) => card.id),
);

console.log(
  "Old Fortified Wall Entered Dead Pile:",
  fortifiedConvertDeadPile.includes(fortifiedOldWallCard),
);

console.log(
  "Attached Fortification Entered Dead Pile:",
  fortifiedConvertDeadPile.includes(fortificationCard),
);

console.log(
  "Fortified Convert Dead Pile Has Two Cards:",
  fortifiedConvertDeadPile.length === 2,
);

console.log(
  "Fortified Convert Card Became Active Wall:",
  fortifiedConvertPlayer.tower[0] === fortifiedConvertCard,
);

console.log(
  "Fortified Convert Card Removed From Hand:",
  fortifiedConvertPlayer.hand.length === 0,
);

console.log(
  "New Converted Wall Starts At 3 HP:",
  fortifiedConvertedWallState?.currentHp === 3,
);

console.log(
  "New Converted Wall Base HP Is 3:",
  fortifiedConvertedWallState?.baseHp === 3,
);

console.log(
  "New Converted Wall Has No Fortification:",
  fortifiedConvertedWallState?.fortification === null,
);

console.log(
  "Hidden Wall Preserved After Fortified Convert:",
  fortifiedConvertPlayer.tower[1] === fortifiedHiddenWallCard,
);

console.log(
  "King Preserved After Fortified Convert:",
  fortifiedConvertPlayer.tower[2] === fortifiedKing,
);

// --------------------------------------------------
// TEST: Invalid Convert preserves all state
// --------------------------------------------------

const invalidOldWallCard = createCard("hearts", "7");

const invalidHiddenWallCard = createCard("diamonds", "6");

const invalidKing = createCard("clubs", "king");

const invalidConvertCard = createCard("spades", "4");

const invalidConvertPlayer = {
  hand: [invalidConvertCard],
  tower: [invalidOldWallCard, invalidHiddenWallCard, invalidKing],
};

const invalidConvertDeadPile = [];

const invalidWallState = createWallState(invalidOldWallCard);

const invalidResult = convertWall(
  invalidConvertPlayer,
  invalidWallState,
  invalidConvertCard,
  invalidConvertDeadPile,
);

console.log("Invalid Convert Returned Undefined:", invalidResult === undefined);

console.log(
  "Invalid Convert Card Remained In Hand:",
  invalidConvertPlayer.hand[0] === invalidConvertCard,
);

console.log(
  "Invalid Convert Preserved Hand Size:",
  invalidConvertPlayer.hand.length === 1,
);

console.log(
  "Invalid Convert Preserved Active Wall:",
  invalidConvertPlayer.tower[0] === invalidOldWallCard,
);

console.log(
  "Invalid Convert Preserved Hidden Wall:",
  invalidConvertPlayer.tower[1] === invalidHiddenWallCard,
);

console.log(
  "Invalid Convert Preserved King:",
  invalidConvertPlayer.tower[2] === invalidKing,
);

console.log(
  "Invalid Convert Preserved Tower Size:",
  invalidConvertPlayer.tower.length === 3,
);

console.log(
  "Invalid Convert Preserved Dead Pile:",
  invalidConvertDeadPile.length === 0,
);

console.log(
  "Invalid Convert Preserved Wall HP:",
  invalidWallState.currentHp === 7,
);

console.log(
  "Invalid Convert Preserved Wall State Card:",
  invalidWallState.card === invalidOldWallCard,
);

// --------------------------------------------------
// TEST: Valid Convert card must belong to player
// --------------------------------------------------

const unownedOldWallCard = createCard(
  "clubs",
  "8",
);

const unownedHiddenWallCard = createCard(
  "hearts",
  "5",
);

const unownedKing = createCard(
  "diamonds",
  "king",
);

const unownedConvertCard = createCard(
  "clubs",
  "3",
);

const unownedPlayer = {
  hand: [],
  tower: [
    unownedOldWallCard,
    unownedHiddenWallCard,
    unownedKing,
  ],
};

const unownedDeadPile = [];

const unownedWallState =
  createWallState(
    unownedOldWallCard,
  );

console.log(
  "Unowned Card Passes Rule Validation:",
  canConvert(
    unownedWallState,
    unownedConvertCard,
  ),
);

const unownedResult =
  convertWall(
    unownedPlayer,
    unownedWallState,
    unownedConvertCard,
    unownedDeadPile,
  );

console.log(
  "Unowned Convert Returned Undefined:",
  unownedResult === undefined,
);

console.log(
  "Unowned Convert Preserved Empty Hand:",
  unownedPlayer.hand.length === 0,
);

console.log(
  "Unowned Convert Preserved Active Wall:",
  unownedPlayer.tower[0] ===
    unownedOldWallCard,
);

console.log(
  "Unowned Convert Preserved Tower Size:",
  unownedPlayer.tower.length === 3,
);

console.log(
  "Unowned Convert Preserved Dead Pile:",
  unownedDeadPile.length === 0,
);

console.log(
  "Unowned Convert Preserved Wall HP:",
  unownedWallState.currentHp === 8,
);