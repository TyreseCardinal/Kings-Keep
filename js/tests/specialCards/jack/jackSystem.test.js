import { createCard } from "../../../systems/cardSystem.js";

import {
  createSiege,
  isValidLane,
  setSiegeSpecialState,
  getLaneAttackValue,
  resolveSiegeLanes,
  canResolveSiegeSpecial,
  areSiegeSpecialsCancelled,
  getBaseSiegeDamage,
getFinalSiegeDamage,
getSweepSpecialSuit,
} from "../../../systems/siegeSystem.js";

import {
  JACK_MODES,
  isJack,
  isValidJackMode,
  createJackState,
  getJackAttackValue,
  isDisruptionJack,
  canResolveDisruptionJack,
  resolveDisruptionJackFortification,
} from "../../../systems/specialCards/jack/jackSystem.js";

import { createWallState } from "../../../systems/wallSystem.js";

import { fortifyWall } from "../../../systems/fortificationSystem.js";
// --------------------------------------------------
// TEST: Jack identification
// --------------------------------------------------

const jackHearts = createCard("hearts", "jack");
const aceHearts = createCard("hearts", "ace");
const tenHearts = createCard("hearts", "10");

console.log("Jack Identified As Jack:", isJack(jackHearts));

console.log("Ace Not Identified As Jack:", !isJack(aceHearts));

console.log("Number Not Identified As Jack:", !isJack(tenHearts));

// --------------------------------------------------
// TEST: Jack modes
// --------------------------------------------------

console.log("Attack Is Valid Jack Mode:", isValidJackMode(JACK_MODES.ATTACK));

console.log(
  "Disruption Is Valid Jack Mode:",
  isValidJackMode(JACK_MODES.DISRUPTION),
);

console.log("Invalid Jack Mode Rejected:", !isValidJackMode("defense"));

// --------------------------------------------------
// TEST: Jack runtime state
// --------------------------------------------------

const attackJackState = createJackState(jackHearts, JACK_MODES.ATTACK);

console.log("Attack Jack State Created:", attackJackState !== undefined);

console.log(
  "Attack Jack State Contains Card:",
  attackJackState?.card === jackHearts,
);

console.log(
  "Attack Jack Mode Locked:",
  attackJackState?.mode === JACK_MODES.ATTACK,
);

const disruptionJackState = createJackState(jackHearts, JACK_MODES.DISRUPTION);

console.log(
  "Disruption Jack State Created:",
  disruptionJackState !== undefined,
);

console.log(
  "Disruption Jack Mode Locked:",
  disruptionJackState?.mode === JACK_MODES.DISRUPTION,
);

// --------------------------------------------------
// TEST: Invalid Jack state creation
// --------------------------------------------------

console.log(
  "Non-Jack State Rejected:",
  createJackState(aceHearts, JACK_MODES.ATTACK) === undefined,
);

console.log(
  "Invalid Mode State Rejected:",
  createJackState(jackHearts, "defense") === undefined,
);

// --------------------------------------------------
// TEST: Card itself was not mutated
// --------------------------------------------------

console.log(
  "Jack Printed Siege Value Remains Zero:",
  jackHearts.siegeValue === 0,
);

// --------------------------------------------------
// TEST: Store Jack runtime state in Siege
// --------------------------------------------------

const jackTestSiege = createSiege();

console.log(
  "Siege Special State Starts Null:",
  jackTestSiege.specialState === null,
);

const storedJackState = setSiegeSpecialState(jackTestSiege, attackJackState);

console.log(
  "Attack Jack State Stored In Siege:",
  jackTestSiege.specialState === attackJackState,
);

console.log("Stored State Returned:", storedJackState === attackJackState);

console.log(
  "Stored Jack Mode Is Attack:",
  jackTestSiege.specialState?.mode === JACK_MODES.ATTACK,
);

console.log(
  "Stored Jack Card Is Original Jack:",
  jackTestSiege.specialState?.card === jackHearts,
);

// --------------------------------------------------
// TEST: Jack effective attack value
// --------------------------------------------------

console.log(
  "Attack Jack Effective Value Is 11:",
  getJackAttackValue(attackJackState) === 11,
);

console.log(
  "Disruption Jack Effective Value Is 0:",
  getJackAttackValue(disruptionJackState) === 0,
);

console.log(
  "Missing Jack State Has Zero Value:",
  getJackAttackValue(null) === 0,
);

console.log(
  "Jack Card Still Has Printed Value Zero:",
  jackHearts.siegeValue === 0,
);

// --------------------------------------------------
// TEST: Jack mode affects Siege lane attack value
// --------------------------------------------------

console.log(
  "Attack Jack Lane Value Is 11:",
  getLaneAttackValue([jackHearts], attackJackState) === 11,
);

console.log(
  "Disruption Jack Lane Value Is 0:",
  getLaneAttackValue([jackHearts], disruptionJackState) === 0,
);

console.log(
  "Jack Without Runtime State Has Lane Value 0:",
  getLaneAttackValue([jackHearts]) === 0,
);

console.log(
  "Attack Calculation Still Does Not Mutate Jack:",
  jackHearts.siegeValue === 0,
);

// --------------------------------------------------
// TEST: Attack Jack participates in lane resolution
// --------------------------------------------------

const attackJackPlayer = {
  siege: createSiege(),
};

const tenPlayer = {
  siege: createSiege(),
};

const attackJackForResolution = createCard("hearts", "jack");

const tenForResolution = createCard("clubs", "10");

attackJackPlayer.siege.left.push(attackJackForResolution);

tenPlayer.siege.left.push(tenForResolution);

const attackJackResolutionState = createJackState(
  attackJackForResolution,
  JACK_MODES.ATTACK,
);

setSiegeSpecialState(attackJackPlayer.siege, attackJackResolutionState);

const attackJackSiegeResults = resolveSiegeLanes(attackJackPlayer, tenPlayer);

console.log("Attack Jack Vs 10 Results:", attackJackSiegeResults);

console.log("Attack Jack Beats 10:", attackJackSiegeResults.left === "playerA");

console.log(
  "Attack Jack Resolves As 11:",
  getLaneAttackValue(
    attackJackPlayer.siege.left,
    attackJackPlayer.siege.specialState,
  ) === 11,
);

console.log(
  "Opponent 10 Resolves As 10:",
  getLaneAttackValue(tenPlayer.siege.left, tenPlayer.siege.specialState) === 10,
);

// --------------------------------------------------
// TEST: Siege runtime state is not a lane
// --------------------------------------------------

console.log(
  "Special State Is Not A Valid Lane:",
  !isValidLane(attackJackPlayer.siege, "specialState"),
);

// --------------------------------------------------
// TEST: Identify Disruption Jack runtime state
// --------------------------------------------------

console.log(
  "Disruption Jack State Identified:",
  isDisruptionJack(disruptionJackState),
);

console.log(
  "Attack Jack Is Not Disruption Jack:",
  !isDisruptionJack(attackJackState),
);

console.log("Missing State Is Not Disruption Jack:", !isDisruptionJack(null));

// --------------------------------------------------
// TEST: Disruption Jack resolution eligibility
// --------------------------------------------------

console.log(
  "Disruption Jack Can Resolve After Special Activation:",
  canResolveDisruptionJack(disruptionJackState, true),
);

console.log(
  "Disruption Jack Rejected Without Special Activation:",
  !canResolveDisruptionJack(disruptionJackState, false),
);

console.log(
  "Attack Jack Cannot Resolve Disruption Effect:",
  !canResolveDisruptionJack(attackJackState, true),
);

// --------------------------------------------------
// TEST: Disruption Jack uses real Siege activation
// --------------------------------------------------

const disruptionPlayer = {
  siege: createSiege(),
};

const disruptionOpponent = {
  siege: createSiege(),
};

const disruptionNumberCard = createCard("hearts", "8");

const disruptionJackCard = createCard("clubs", "jack");

const disruptionOpponentCard = createCard("spades", "6");

disruptionPlayer.siege.left.push(disruptionNumberCard);

disruptionPlayer.siege.center.push(disruptionJackCard);

disruptionOpponent.siege.left.push(disruptionOpponentCard);

const realDisruptionState = createJackState(
  disruptionJackCard,
  JACK_MODES.DISRUPTION,
);

setSiegeSpecialState(disruptionPlayer.siege, realDisruptionState);

const disruptionSiegeResults = resolveSiegeLanes(
  disruptionPlayer,
  disruptionOpponent,
);

const disruptionSpecialCanResolve = canResolveSiegeSpecial(
  disruptionPlayer,
  disruptionOpponent,
  disruptionSiegeResults,
  "playerA",
);

console.log("Disruption Jack Siege Results:", disruptionSiegeResults);

console.log(
  "Numbered Lane Win Activates Disruption Jack:",
  disruptionSpecialCanResolve,
);

console.log(
  "Disruption Jack Resolves From Real Siege Activation:",
  canResolveDisruptionJack(realDisruptionState, disruptionSpecialCanResolve),
);

// --------------------------------------------------
// TEST: Disruption Jack destroys Fortification
// --------------------------------------------------

const disruptionTargetWallCard = createCard("diamonds", "7");

const disruptionFortificationCard = createCard("clubs", "7");

const disruptionTargetWall = createWallState(disruptionTargetWallCard);

const disruptionFortificationPlayer = {
  hand: [disruptionFortificationCard],
};

const disruptionDeadPile = [];

fortifyWall(
  disruptionFortificationPlayer,
  disruptionTargetWall,
  disruptionFortificationCard,
);

console.log("Jack Target Wall HP Before:", disruptionTargetWall.currentHp);

console.log(
  "Jack Target Has Fortification Before:",
  disruptionTargetWall.fortification !== null,
);

console.log("Jack Dead Pile Before:", disruptionDeadPile.length);

const disruptionFortificationDestroyed = resolveDisruptionJackFortification(
  realDisruptionState,
  disruptionSpecialCanResolve,
  disruptionTargetWall,
  disruptionDeadPile,
);

console.log(
  "Disruption Jack Destroyed Fortification:",
  disruptionFortificationDestroyed,
);

console.log(
  "Jack Target Has No Fortification After:",
  disruptionTargetWall.fortification === null,
);

console.log("Jack Dead Pile After:", disruptionDeadPile.length);

console.log(
  "Destroyed Fortification Entered Dead Pile:",
  disruptionDeadPile.includes(disruptionFortificationCard),
);

console.log("Jack Target Wall HP After:", disruptionTargetWall.currentHp);

// --------------------------------------------------
// TEST: Disruption Jack preserves underlying Wall HP
// --------------------------------------------------

const damagedJackWallCard = createCard("hearts", "7");

const damagedJackFortificationCard = createCard("spades", "7");

const damagedJackWall = createWallState(damagedJackWallCard);

const damagedJackDefender = {
  hand: [damagedJackFortificationCard],
};

const damagedJackDeadPile = [];

fortifyWall(damagedJackDefender, damagedJackWall, damagedJackFortificationCard);

// Simulate previous damage:
// 7 Wall + 7 Fortification = 14 HP
// 6 damage leaves 8 total HP.
damagedJackWall.currentHp = 8;

console.log("Damaged Fortification HP Before Jack:", damagedJackWall.currentHp);

console.log(
  "Damaged Fortification Exists Before Jack:",
  damagedJackWall.fortification !== null,
);

const damagedFortificationDestroyed = resolveDisruptionJackFortification(
  realDisruptionState,
  disruptionSpecialCanResolve,
  damagedJackWall,
  damagedJackDeadPile,
);

console.log(
  "Damaged Fortification Destroyed By Jack:",
  damagedFortificationDestroyed,
);

console.log(
  "Underlying Wall HP Preserved At 7:",
  damagedJackWall.currentHp === 7,
);

console.log(
  "Damaged Fortification Removed:",
  damagedJackWall.fortification === null,
);

console.log(
  "Damaged Fortification Entered Dead Pile:",
  damagedJackDeadPile.includes(damagedJackFortificationCard),
);

// --------------------------------------------------
// TEST: Jack cancellation depends on Jack mode
// --------------------------------------------------

const attackCancelJackA = createCard("hearts", "jack");

const attackCancelJackB = createCard("clubs", "jack");

const attackCancelPlayerA = {
  siege: createSiege(),
};

const attackCancelPlayerB = {
  siege: createSiege(),
};

attackCancelPlayerA.siege.left.push(attackCancelJackA);

attackCancelPlayerB.siege.left.push(attackCancelJackB);

setSiegeSpecialState(
  attackCancelPlayerA.siege,
  createJackState(attackCancelJackA, JACK_MODES.ATTACK),
);

setSiegeSpecialState(
  attackCancelPlayerB.siege,
  createJackState(attackCancelJackB, JACK_MODES.ATTACK),
);

console.log(
  "Attack Jack Vs Attack Jack Does Not Cancel:",
  areSiegeSpecialsCancelled(attackCancelPlayerA, attackCancelPlayerB) === false,
);

// --------------------------------------------------
// Disruption Jack vs Disruption Jack
// --------------------------------------------------

const disruptionCancelJackA = createCard("diamonds", "jack");

const disruptionCancelJackB = createCard("spades", "jack");

const disruptionCancelPlayerA = {
  siege: createSiege(),
};

const disruptionCancelPlayerB = {
  siege: createSiege(),
};

disruptionCancelPlayerA.siege.left.push(disruptionCancelJackA);

disruptionCancelPlayerB.siege.left.push(disruptionCancelJackB);

setSiegeSpecialState(
  disruptionCancelPlayerA.siege,
  createJackState(disruptionCancelJackA, JACK_MODES.DISRUPTION),
);

setSiegeSpecialState(
  disruptionCancelPlayerB.siege,
  createJackState(disruptionCancelJackB, JACK_MODES.DISRUPTION),
);

console.log(
  "Disruption Jack Vs Disruption Jack Cancels:",
  areSiegeSpecialsCancelled(
    disruptionCancelPlayerA,
    disruptionCancelPlayerB,
  ) === true,
);

// --------------------------------------------------
// Attack Jack vs Disruption Jack
// --------------------------------------------------

const mixedCancelJackA = createCard("hearts", "jack");

const mixedCancelJackB = createCard("clubs", "jack");

const mixedCancelPlayerA = {
  siege: createSiege(),
};

const mixedCancelPlayerB = {
  siege: createSiege(),
};

mixedCancelPlayerA.siege.left.push(mixedCancelJackA);

mixedCancelPlayerB.siege.left.push(mixedCancelJackB);

setSiegeSpecialState(
  mixedCancelPlayerA.siege,
  createJackState(mixedCancelJackA, JACK_MODES.ATTACK),
);

setSiegeSpecialState(
  mixedCancelPlayerB.siege,
  createJackState(mixedCancelJackB, JACK_MODES.DISRUPTION),
);

console.log(
  "Attack Jack Vs Disruption Jack Does Not Cancel:",
  areSiegeSpecialsCancelled(mixedCancelPlayerA, mixedCancelPlayerB) === false,
);

// --------------------------------------------------
// TEST: Attack Jack suit can activate Suit Repetition,
// but Jack's 11 does not become Siege damage
// --------------------------------------------------

const repetitionAttackJack = createCard("hearts", "jack");

const repetitionNumberCard = createCard("hearts", "8");

const repetitionOpponentCard = createCard("clubs", "6");

const repetitionActiveWall = createCard("hearts", "7");

const repetitionJackPlayer = {
  siege: createSiege(),
};

const repetitionJackOpponent = {
  siege: createSiege(),
};

repetitionJackPlayer.siege.left.push(repetitionNumberCard);

repetitionJackPlayer.siege.center.push(repetitionAttackJack);

repetitionJackOpponent.siege.left.push(repetitionOpponentCard);

const repetitionAttackJackState = createJackState(
  repetitionAttackJack,
  JACK_MODES.ATTACK,
);

setSiegeSpecialState(repetitionJackPlayer.siege, repetitionAttackJackState);

const repetitionJackResults = resolveSiegeLanes(
  repetitionJackPlayer,
  repetitionJackOpponent,
);

console.log("Attack Jack Repetition Siege Results:", repetitionJackResults);

console.log(
  "Attack Jack Wins Lane As 11:",
  repetitionJackResults.center === "playerA",
);

const repetitionJackBaseDamage =
  getBaseSiegeDamage(
    repetitionJackPlayer,
    repetitionJackResults,
    "playerA",
  );

const repetitionJackSpecialSuit =
  getSweepSpecialSuit(
    repetitionJackPlayer,
    repetitionJackOpponent,
    repetitionJackResults,
    "playerA",
  );

const repetitionJackFinalDamage =
  getFinalSiegeDamage(
    repetitionJackPlayer,
    repetitionJackOpponent,
    repetitionJackResults,
    "playerA",
    repetitionActiveWall,
  );

console.log(
  "Attack Jack Base Numbered Damage:",
  repetitionJackBaseDamage,
);

console.log(
  "Attack Jack 11 Excluded From Base Damage:",
  repetitionJackBaseDamage === 8,
);

console.log(
  "Attack Jack Special Suit:",
  repetitionJackSpecialSuit,
);

console.log(
  "Attack Jack Hearts Can Activate Repetition:",
  repetitionJackSpecialSuit === "hearts",
);

console.log(
  "Attack Jack Final Siege Damage:",
  repetitionJackFinalDamage,
);

console.log(
  "Only Number Card Repeats, Not Jack 11:",
  repetitionJackFinalDamage === 16,
);