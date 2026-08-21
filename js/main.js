import {
  createDeck,
  createTowerCreationDeck,
  shuffleDeck,
  dealTowerCards,
  dealStartingKings,
  createDrawPile
} from "./systems/deckSystem.js";

const deck = createDeck();

const {
  towerCreationDeck,
  specialReserve
} = createTowerCreationDeck(deck);

shuffleDeck(towerCreationDeck);

const {
  playerATower,
  playerBTower
} = dealTowerCards(towerCreationDeck);

const {
  playerAKing,
  playerBKing
} = dealStartingKings(specialReserve);

const drawPile = createDrawPile(
  towerCreationDeck,
  specialReserve
);

playerATower.push(playerAKing);
playerBTower.push(playerBKing);

console.log(playerATower);
console.log(playerBTower);

console.log(drawPile);