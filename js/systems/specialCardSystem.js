export function isSiegeSpecialCard(card) {
  return (
    card?.type === "special" &&
    ["ace", "jack", "queen"].includes(card.rank)
  );
}