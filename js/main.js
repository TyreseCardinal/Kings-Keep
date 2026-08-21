import {
  createDeck,
  createTowerCreationDeck,
  shuffleDeck,
  dealTowerCards
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

console.log(playerATower);
console.log(playerBTower);

console.log(playerATower.length);
console.log(playerBTower.length);

console.log(towerCreationDeck.length);
console.log(specialReserve.length);