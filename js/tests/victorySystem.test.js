import { createCard } from "../systems/cardSystem.js";

import { createPlayer } from "../systems/playerSystem.js";

import { createKingState } from "../systems/kingSystem.js";

import {
  isPlayerDefeated,
  getWinner,
} from "../systems/victorySystem.js";

console.log("----- VICTORY SYSTEM TESTS -----");

const victoryPlayer = createPlayer("victoryPlayer");

const victoryKing = createCard("hearts", "king");

victoryPlayer.tower.push(victoryKing);

victoryPlayer.kingState = createKingState(victoryKing);

console.log(
  "Healthy Player Is Not Defeated:",
  isPlayerDefeated(victoryPlayer) === false,
);

victoryPlayer.kingState.currentHp = 0;

console.log(
  "Defeated Original King Defeats Player:",
  isPlayerDefeated(victoryPlayer) === true,
);

const winnerPlayerA = createPlayer("winnerPlayerA");

const winnerPlayerB = createPlayer("winnerPlayerB");

const winnerKingA = createCard("clubs", "king");

const winnerKingB = createCard("spades", "king");

winnerPlayerA.tower.push(winnerKingA);

winnerPlayerB.tower.push(winnerKingB);

winnerPlayerA.kingState = createKingState(winnerKingA);

winnerPlayerB.kingState = createKingState(winnerKingB);

console.log(
  "Healthy Players Have No Winner:",
  getWinner(winnerPlayerA, winnerPlayerB) === null,
);

winnerPlayerB.kingState.currentHp = 0;

console.log(
  "Player A Wins When Player B Is Defeated:",
  getWinner(winnerPlayerA, winnerPlayerB) === winnerPlayerA,
);
