import {
  createPlayer,
} from "../systems/playerSystem.js";

import {
  createCard,
} from "../systems/cardSystem.js";

import {
  canStartSortie,
  createSortieState,
} from "../systems/sortieSystem.js";

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