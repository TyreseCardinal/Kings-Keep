import {
  createPlayer,
} from "../systems/playerSystem.js";

import {
  createCard,
} from "../systems/cardSystem.js";

import {
  canStartSortie,
  createSortieState,
  getSortieProgress,
  isSortieComplete,
  recordSortieWin,
  preserveSortieOnTie,
  resetSortieProgress,
  rebuildWallsFromSortie,
  cancelSortie,
} from "../systems/sortieSystem.js";

import {
  getCombatPhase,
  PHASES,
} from "../systems/phaseSystem.js";

import {
  getActiveDefense,
} from "../systems/towerSystem.js";

console.log(
  "----- SORTIE SYSTEM TESTS -----",
);

// ---------------------------------------------
// Shared Cards
// ---------------------------------------------

const playerAKing = createCard(
  "hearts",
  "king",
);

const playerBKing = createCard(
  "spades",
  "king",
);

const playerAWall = createCard(
  "clubs",
  "7",
);

const playerBWall = createCard(
  "diamonds",
  "6",
);

// ---------------------------------------------
// Normal Siege
// Both Players Have Walls
// ---------------------------------------------

const normalPlayerA = createPlayer(
  "normalPlayerA",
);

const normalPlayerB = createPlayer(
  "normalPlayerB",
);

normalPlayerA.tower.push(
  playerAWall,
  playerAKing,
);

normalPlayerB.tower.push(
  playerBWall,
  playerBKing,
);

console.log(
  "Normal Siege Player A Cannot Start Sortie:",
  canStartSortie(
    normalPlayerA,
    normalPlayerA,
    normalPlayerB,
  ) === false,
);

console.log(
  "Normal Siege Player B Cannot Start Sortie:",
  canStartSortie(
    normalPlayerB,
    normalPlayerA,
    normalPlayerB,
  ) === false,
);

console.log(
  "Normal Siege Sortie State Not Created:",
  createSortieState(
    normalPlayerA,
    normalPlayerA,
    normalPlayerB,
  ) === undefined,
);

// ---------------------------------------------
// Player A In Last Stand
// ---------------------------------------------

const playerALastStand = createPlayer(
  "playerALastStand",
);

const playerBOpponent = createPlayer(
  "playerBOpponent",
);

playerALastStand.tower.push(
  playerAKing,
);

playerBOpponent.tower.push(
  playerBWall,
  playerBKing,
);

console.log(
  "Player A Can Start Sortie In Last Stand:",
  canStartSortie(
    playerALastStand,
    playerALastStand,
    playerBOpponent,
  ),
);

console.log(
  "Player B Cannot Start Player A Sortie:",
  canStartSortie(
    playerBOpponent,
    playerALastStand,
    playerBOpponent,
  ) === false,
);

const playerASortieState =
  createSortieState(
    playerALastStand,
    playerALastStand,
    playerBOpponent,
  );

console.log(
  "Player A Sortie State Created:",
  playerASortieState !== undefined,
);

console.log(
  "Player A Is Eligible Sortie Player:",
  playerASortieState?.eligiblePlayer ===
    playerALastStand,
);

console.log(
  "Sortie Starts With Empty Reserve:",
  playerASortieState?.cards.length === 0,
);

console.log(
  "Sortie Starts Active:",
  playerASortieState?.active === true,
);

// ---------------------------------------------
// Player B In Last Stand
// ---------------------------------------------

const playerAOpponent = createPlayer(
  "playerAOpponent",
);

const playerBLastStand = createPlayer(
  "playerBLastStand",
);

playerAOpponent.tower.push(
  playerAWall,
  playerAKing,
);

playerBLastStand.tower.push(
  playerBKing,
);

console.log(
  "Player B Can Start Sortie In Last Stand:",
  canStartSortie(
    playerBLastStand,
    playerAOpponent,
    playerBLastStand,
  ),
);

console.log(
  "Player A Cannot Start Player B Sortie:",
  canStartSortie(
    playerAOpponent,
    playerAOpponent,
    playerBLastStand,
  ) === false,
);

const playerBSortieState =
  createSortieState(
    playerBLastStand,
    playerAOpponent,
    playerBLastStand,
  );

console.log(
  "Player B Sortie State Created:",
  playerBSortieState !== undefined,
);

console.log(
  "Player B Is Eligible Sortie Player:",
  playerBSortieState?.eligiblePlayer ===
    playerBLastStand,
);

// ---------------------------------------------
// Endgame
// Neither Player Has Walls
// ---------------------------------------------

const endgamePlayerA = createPlayer(
  "endgamePlayerA",
);

const endgamePlayerB = createPlayer(
  "endgamePlayerB",
);

endgamePlayerA.tower.push(
  playerAKing,
);

endgamePlayerB.tower.push(
  playerBKing,
);

console.log(
  "Endgame Player A Cannot Start Sortie:",
  canStartSortie(
    endgamePlayerA,
    endgamePlayerA,
    endgamePlayerB,
  ) === false,
);

console.log(
  "Endgame Player B Cannot Start Sortie:",
  canStartSortie(
    endgamePlayerB,
    endgamePlayerA,
    endgamePlayerB,
  ) === false,
);

console.log(
  "Endgame Sortie State Not Created:",
  createSortieState(
    endgamePlayerA,
    endgamePlayerA,
    endgamePlayerB,
  ) === undefined,
);

// ---------------------------------------------
// Sortie Progress / Reserve Tests
// ---------------------------------------------

const progressPlayer = createPlayer(
  "progressPlayer",
);

const progressOpponent = createPlayer(
  "progressOpponent",
);

const progressKing = createCard(
  "hearts",
  "king",
);

const progressOpponentWall = createCard(
  "clubs",
  "6",
);

const progressOpponentKing = createCard(
  "spades",
  "king",
);

progressPlayer.tower.push(
  progressKing,
);

progressOpponent.tower.push(
  progressOpponentWall,
  progressOpponentKing,
);

const progressSortieState =
  createSortieState(
    progressPlayer,
    progressPlayer,
    progressOpponent,
  );

console.log(
  "Sortie Progress Starts At Zero:",
  getSortieProgress(
    progressSortieState,
  ) === 0,
);

console.log(
  "Sortie Not Complete At Zero:",
  isSortieComplete(
    progressSortieState,
  ) === false,
);

// ---------------------------------------------
// First Sortie Win
// ---------------------------------------------

const firstWinCard = createCard(
  "hearts",
  "7",
);

progressPlayer.siege.center.push(
  firstWinCard,
);

console.log(
  "First Sortie Win Recorded:",
  recordSortieWin(
    progressSortieState,
    progressPlayer,
    firstWinCard,
  ),
);

console.log(
  "First Win Removed From Center Lane:",
  progressPlayer.siege.center.length === 0,
);

console.log(
  "First Win Entered Sortie Reserve:",
  progressSortieState.cards[0] ===
    firstWinCard,
);

console.log(
  "Sortie Progress Is One:",
  getSortieProgress(
    progressSortieState,
  ) === 1,
);

console.log(
  "Sortie Not Complete At One:",
  isSortieComplete(
    progressSortieState,
  ) === false,
);

// ---------------------------------------------
// Tie Preserves Progress
// ---------------------------------------------

console.log(
  "Sortie Tie Preserved:",
  preserveSortieOnTie(
    progressSortieState,
  ),
);

console.log(
  "Tie Preserved One Reserved Card:",
  getSortieProgress(
    progressSortieState,
  ) === 1,
);

console.log(
  "Tie Preserved First Win Card:",
  progressSortieState.cards[0] ===
    firstWinCard,
);

// ---------------------------------------------
// Second Sortie Win
// ---------------------------------------------

const secondWinCard = createCard(
  "diamonds",
  "4",
);

progressPlayer.siege.center.push(
  secondWinCard,
);

console.log(
  "Second Sortie Win Recorded:",
  recordSortieWin(
    progressSortieState,
    progressPlayer,
    secondWinCard,
  ),
);

console.log(
  "Sortie Progress Is Two:",
  getSortieProgress(
    progressSortieState,
  ) === 2,
);

console.log(
  "Sortie Not Complete At Two:",
  isSortieComplete(
    progressSortieState,
  ) === false,
);

// ---------------------------------------------
// Third Sortie Win
// ---------------------------------------------

const thirdWinCard = createCard(
  "spades",
  "9",
);

progressPlayer.siege.center.push(
  thirdWinCard,
);

console.log(
  "Third Sortie Win Recorded:",
  recordSortieWin(
    progressSortieState,
    progressPlayer,
    thirdWinCard,
  ),
);

console.log(
  "Sortie Progress Is Three:",
  getSortieProgress(
    progressSortieState,
  ) === 3,
);

console.log(
  "Sortie Complete At Three:",
  isSortieComplete(
    progressSortieState,
  ),
);

console.log(
  "Sortie Reserve Preserved Win Order:",
  progressSortieState.cards[0] ===
    firstWinCard &&
  progressSortieState.cards[1] ===
    secondWinCard &&
  progressSortieState.cards[2] ===
    thirdWinCard,
);

// ---------------------------------------------
// Fourth Win Rejected
// ---------------------------------------------

const fourthWinCard = createCard(
  "clubs",
  "10",
);

progressPlayer.siege.center.push(
  fourthWinCard,
);

console.log(
  "Fourth Sortie Win Rejected:",
  recordSortieWin(
    progressSortieState,
    progressPlayer,
    fourthWinCard,
  ) === false,
);

console.log(
  "Completed Sortie Remains At Three:",
  progressSortieState.cards.length === 3,
);

console.log(
  "Rejected Fourth Card Remains In Lane:",
  progressPlayer.siege.center[0] ===
    fourthWinCard,
);

// ---------------------------------------------
// Invalid Sortie Win Rejections
// ---------------------------------------------

const wrongPlayer = createPlayer(
  "wrongPlayer",
);

const wrongPlayerCard = createCard(
  "clubs",
  "5",
);

wrongPlayer.siege.center.push(
  wrongPlayerCard,
);

console.log(
  "Wrong Player Sortie Win Rejected:",
  recordSortieWin(
    progressSortieState,
    wrongPlayer,
    wrongPlayerCard,
  ) === false,
);

const unownedWinCard = createCard(
  "diamonds",
  "8",
);

console.log(
  "Card Outside Center Lane Rejected:",
  recordSortieWin(
    progressSortieState,
    progressPlayer,
    unownedWinCard,
  ) === false,
);

// ---------------------------------------------
// Loss Resets Sortie Progress
// ---------------------------------------------

const resetPlayer = createPlayer(
  "resetPlayer",
);

const resetOpponent = createPlayer(
  "resetOpponent",
);

const resetKing = createCard(
  "clubs",
  "king",
);

const resetOpponentWall = createCard(
  "hearts",
  "8",
);

const resetOpponentKing = createCard(
  "diamonds",
  "king",
);

resetPlayer.tower.push(
  resetKing,
);

resetOpponent.tower.push(
  resetOpponentWall,
  resetOpponentKing,
);

const resetSortieState =
  createSortieState(
    resetPlayer,
    resetPlayer,
    resetOpponent,
  );

const resetCardOne = createCard(
  "clubs",
  "6",
);

const resetCardTwo = createCard(
  "spades",
  "7",
);

resetPlayer.siege.center.push(
  resetCardOne,
);

recordSortieWin(
  resetSortieState,
  resetPlayer,
  resetCardOne,
);

resetPlayer.siege.center.push(
  resetCardTwo,
);

recordSortieWin(
  resetSortieState,
  resetPlayer,
  resetCardTwo,
);

const resetDeadPile = [];

console.log(
  "Reset Test Starts With Two Wins:",
  resetSortieState.cards.length === 2,
);

console.log(
  "Sortie Loss Reset Succeeds:",
  resetSortieProgress(
    resetSortieState,
    resetDeadPile,
  ),
);

console.log(
  "Sortie Loss Resets Progress To Zero:",
  resetSortieState.cards.length === 0,
);

console.log(
  "Reset Sends Reserved Cards To Dead Pile:",
  resetDeadPile.length === 2,
);

console.log(
  "Reset Preserves Reserved Card Order:",
  resetDeadPile[0] === resetCardOne &&
  resetDeadPile[1] === resetCardTwo,
);

console.log(
  "Sortie Can Build Progress Again After Reset:",
  isSortieComplete(
    resetSortieState,
  ) === false &&
  getSortieProgress(
    resetSortieState,
  ) === 0,
);

// ---------------------------------------------
// Successful Sortie Wall Reconstruction
// ---------------------------------------------

const rebuildPlayer = createPlayer(
  "rebuildPlayer",
);

const rebuildOpponent = createPlayer(
  "rebuildOpponent",
);

const rebuildKing = createCard(
  "hearts",
  "king",
);

const rebuildOpponentWall = createCard(
  "clubs",
  "8",
);

const rebuildOpponentKing = createCard(
  "spades",
  "king",
);

rebuildPlayer.tower.push(
  rebuildKing,
);

rebuildOpponent.tower.push(
  rebuildOpponentWall,
  rebuildOpponentKing,
);

const rebuildSortieState =
  createSortieState(
    rebuildPlayer,
    rebuildPlayer,
    rebuildOpponent,
  );

const rebuildFirstWin = createCard(
  "clubs",
  "7",
);

const rebuildSecondWin = createCard(
  "hearts",
  "4",
);

const rebuildThirdWin = createCard(
  "spades",
  "9",
);

rebuildPlayer.siege.center.push(
  rebuildFirstWin,
);

recordSortieWin(
  rebuildSortieState,
  rebuildPlayer,
  rebuildFirstWin,
);

rebuildPlayer.siege.center.push(
  rebuildSecondWin,
);

recordSortieWin(
  rebuildSortieState,
  rebuildPlayer,
  rebuildSecondWin,
);

rebuildPlayer.siege.center.push(
  rebuildThirdWin,
);

recordSortieWin(
  rebuildSortieState,
  rebuildPlayer,
  rebuildThirdWin,
);

console.log(
  "Rebuild Test Sortie Is Complete:",
  isSortieComplete(
    rebuildSortieState,
  ),
);

console.log(
  "Rebuild Test Starts In Last Stand:",
  getCombatPhase(
    rebuildPlayer,
    rebuildOpponent,
  ) === PHASES.LAST_STAND,
);

console.log(
  "Successful Sortie Rebuilds Walls:",
  rebuildWallsFromSortie(
    rebuildSortieState,
    rebuildPlayer,
  ),
);

console.log(
  "Rebuilt Tower Has Three Walls And King:",
  rebuildPlayer.tower.length === 4,
);

console.log(
  "Third Win Became Active Wall:",
  rebuildPlayer.tower[0] ===
    rebuildThirdWin,
);

console.log(
  "Second Win Became Middle Wall:",
  rebuildPlayer.tower[1] ===
    rebuildSecondWin,
);

console.log(
  "First Win Became Inner Wall:",
  rebuildPlayer.tower[2] ===
    rebuildFirstWin,
);

console.log(
  "Original King Remained At End:",
  rebuildPlayer.tower[3] ===
    rebuildKing,
);

console.log(
  "Sortie Reserve Empty After Rebuild:",
  rebuildSortieState.cards.length === 0,
);

console.log(
  "Sortie Becomes Inactive After Rebuild:",
  rebuildSortieState.active === false,
);

console.log(
  "Third Win Is New Active Defense:",
  getActiveDefense(
    rebuildPlayer,
  ) === rebuildThirdWin,
);

console.log(
  "Rebuilt Active Wall State Created:",
  rebuildPlayer.activeWallState !==
    null,
);

console.log(
  "Successful Sortie Returns To Normal Siege:",
  getCombatPhase(
    rebuildPlayer,
    rebuildOpponent,
  ) === PHASES.NORMAL_SIEGE,
);

// ---------------------------------------------
// Invalid Reconstruction
// ---------------------------------------------

const incompletePlayer = createPlayer(
  "incompletePlayer",
);

const incompleteOpponent = createPlayer(
  "incompleteOpponent",
);

const incompleteKing = createCard(
  "diamonds",
  "king",
);

const incompleteOpponentWall =
  createCard(
    "hearts",
    "5",
  );

const incompleteOpponentKing =
  createCard(
    "clubs",
    "king",
  );

incompletePlayer.tower.push(
  incompleteKing,
);

incompleteOpponent.tower.push(
  incompleteOpponentWall,
  incompleteOpponentKing,
);

const incompleteSortieState =
  createSortieState(
    incompletePlayer,
    incompletePlayer,
    incompleteOpponent,
  );

const incompleteWin = createCard(
  "diamonds",
  "6",
);

incompletePlayer.siege.center.push(
  incompleteWin,
);

recordSortieWin(
  incompleteSortieState,
  incompletePlayer,
  incompleteWin,
);

console.log(
  "Incomplete Sortie Rebuild Rejected:",
  rebuildWallsFromSortie(
    incompleteSortieState,
    incompletePlayer,
  ) === false,
);

console.log(
  "Rejected Rebuild Preserved King-Only Tower:",
  incompletePlayer.tower.length === 1 &&
  incompletePlayer.tower[0] ===
    incompleteKing,
);

console.log(
  "Rejected Rebuild Preserved Reserve:",
  incompleteSortieState.cards.length ===
    1 &&
  incompleteSortieState.cards[0] ===
    incompleteWin,
);

console.log(
  "Rejected Rebuild Preserved Active Sortie:",
  incompleteSortieState.active === true,
);

// ---------------------------------------------
// Sortie Cancellation / Endgame Transition
// ---------------------------------------------

const cancelPlayer = createPlayer(
  "cancelPlayer",
);

const cancelOpponent = createPlayer(
  "cancelOpponent",
);

const cancelPlayerKing = createCard(
  "hearts",
  "king",
);

const cancelOpponentWall = createCard(
  "clubs",
  "5",
);

const cancelOpponentKing = createCard(
  "spades",
  "king",
);

cancelPlayer.tower.push(
  cancelPlayerKing,
);

cancelOpponent.tower.push(
  cancelOpponentWall,
  cancelOpponentKing,
);

const cancelSortieState =
  createSortieState(
    cancelPlayer,
    cancelPlayer,
    cancelOpponent,
  );

const cancelFirstWin = createCard(
  "hearts",
  "7",
);

const cancelSecondWin = createCard(
  "diamonds",
  "4",
);

cancelPlayer.siege.center.push(
  cancelFirstWin,
);

recordSortieWin(
  cancelSortieState,
  cancelPlayer,
  cancelFirstWin,
);

cancelPlayer.siege.center.push(
  cancelSecondWin,
);

recordSortieWin(
  cancelSortieState,
  cancelPlayer,
  cancelSecondWin,
);

console.log(
  "Cancellation Test Starts With Two Reserved Cards:",
  cancelSortieState.cards.length === 2,
);

console.log(
  "Cancellation Test Starts In Last Stand:",
  getCombatPhase(
    cancelPlayer,
    cancelOpponent,
  ) === PHASES.LAST_STAND,
);

// Simulate opponent losing final Wall.
// We are only testing Sortie lifecycle here,
// not Wall destruction itself.

cancelOpponent.tower.shift();

console.log(
  "Final Opponent Wall Removal Causes Endgame:",
  getCombatPhase(
    cancelPlayer,
    cancelOpponent,
  ) === PHASES.ENDGAME,
);

const cancelDeadPile = [];

console.log(
  "Active Sortie Cancels Successfully:",
  cancelSortie(
    cancelSortieState,
    cancelDeadPile,
  ),
);

console.log(
  "Cancelled Sortie Reserve Is Empty:",
  cancelSortieState.cards.length === 0,
);

console.log(
  "Cancelled Sortie Becomes Inactive:",
  cancelSortieState.active === false,
);

console.log(
  "Cancelled Reserved Cards Enter Dead Pile:",
  cancelDeadPile.length === 2,
);

console.log(
  "Cancelled Cards Preserve Reserve Order:",
  cancelDeadPile[0] ===
    cancelFirstWin &&
  cancelDeadPile[1] ===
    cancelSecondWin,
);

console.log(
  "Cancelled Sortie Cannot Rebuild Walls:",
  rebuildWallsFromSortie(
    cancelSortieState,
    cancelPlayer,
  ) === false,
);

console.log(
  "Cancelled Sortie Leaves Player King-Only:",
  cancelPlayer.tower.length === 1 &&
  cancelPlayer.tower[0] ===
    cancelPlayerKing,
);

console.log(
  "Endgame Has No Sortie Eligible Player:",
  canStartSortie(
    cancelPlayer,
    cancelPlayer,
    cancelOpponent,
  ) === false,
);

// ---------------------------------------------
// Completed But Cancelled Sortie
// ---------------------------------------------

const completedCancelPlayer =
  createPlayer(
    "completedCancelPlayer",
  );

const completedCancelOpponent =
  createPlayer(
    "completedCancelOpponent",
  );

const completedCancelKing =
  createCard(
    "clubs",
    "king",
  );

const completedCancelOpponentWall =
  createCard(
    "diamonds",
    "8",
  );

const completedCancelOpponentKing =
  createCard(
    "hearts",
    "king",
  );

completedCancelPlayer.tower.push(
  completedCancelKing,
);

completedCancelOpponent.tower.push(
  completedCancelOpponentWall,
  completedCancelOpponentKing,
);

const completedCancelState =
  createSortieState(
    completedCancelPlayer,
    completedCancelPlayer,
    completedCancelOpponent,
  );

const completedCardOne = createCard(
  "clubs",
  "6",
);

const completedCardTwo = createCard(
  "hearts",
  "7",
);

const completedCardThree = createCard(
  "spades",
  "9",
);

completedCancelPlayer.siege.center.push(
  completedCardOne,
);

recordSortieWin(
  completedCancelState,
  completedCancelPlayer,
  completedCardOne,
);

completedCancelPlayer.siege.center.push(
  completedCardTwo,
);

recordSortieWin(
  completedCancelState,
  completedCancelPlayer,
  completedCardTwo,
);

completedCancelPlayer.siege.center.push(
  completedCardThree,
);

recordSortieWin(
  completedCancelState,
  completedCancelPlayer,
  completedCardThree,
);

console.log(
  "Completed Cancellation Test Starts Complete:",
  isSortieComplete(
    completedCancelState,
  ),
);

// Simulate opponent losing final Wall
// before the rebuild operation occurs.

completedCancelOpponent.tower.shift();

const completedCancelDeadPile = [];

console.log(
  "Completed Sortie Can Still Be Cancelled:",
  cancelSortie(
    completedCancelState,
    completedCancelDeadPile,
  ),
);

console.log(
  "Completed Cancelled Sortie Is Inactive:",
  completedCancelState.active === false,
);

console.log(
  "Completed Cancelled Reserve Is Empty:",
  completedCancelState.cards.length === 0,
);

console.log(
  "Three Completed Cards Enter Dead Pile:",
  completedCancelDeadPile.length === 3,
);

console.log(
  "Completed Cancelled Sortie Cannot Rebuild:",
  rebuildWallsFromSortie(
    completedCancelState,
    completedCancelPlayer,
  ) === false,
);

console.log(
  "Completed Cancellation Still Leaves Endgame:",
  getCombatPhase(
    completedCancelPlayer,
    completedCancelOpponent,
  ) === PHASES.ENDGAME,
);