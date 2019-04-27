export function isUserTurn(user, game) {
  return (
    (game.currentTurn === 'first' && user.pk === game.firstPlayer.pk) ||
    (game.currentTurn === 'second' && user.pk === game.secondPlayer.pk)
  );
}
