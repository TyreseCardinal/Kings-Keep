import {
  createDeck,
  createTowerCreationDeck,
  shuffleDeck,
  dealTowerCards,
  dealStartingKings
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


console.log(playerATower);
console.log(playerBTower);

console.log(playerAKing);
console.log(playerBKing);
console.log(specialReserve.length);