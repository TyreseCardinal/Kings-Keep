export function moveCard(source, destination) {
  if (source.length === 0) {
    return;
  }

  const card = source.shift();

  destination.push(card);

  return card;
}

export function moveCardAtIndex(source, destination, index) {
  if (source.length === 0) {
    return;
  }

  if (index >= source.length || index < 0) {
    return;
  }

  const removedCards = source.splice(index, 1);
  const card = removedCards[0];

  destination.push(card);

  return card;
}

export function moveCardById(source, destination, cardId) {
  const index = source.findIndex((card) => {
    return card.id === cardId;
  });

  if (index === -1) {
    return;
  }

  return moveCardAtIndex(source, destination, index);
}

export function moveCards(source, destination, amount) {
  let i = 0;

  while (i !== amount && source.length > 0) {
    moveCard(source, destination);
    i++;
  }
  return i;
}

export function recycleDeadPile(drawPile, deadPile, shuffle) {
  if (drawPile.length > 0) {
    return;
  }

  if (deadPile.length === 0) {
    return;
  }

  moveCards(deadPile, drawPile, deadPile.length);

  shuffle(drawPile);
}
