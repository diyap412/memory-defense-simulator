export const gameState = {
  health: 3,
  score: 0,
  level: 1,
  gameOver: false
};

export function resetGame() {
  gameState.health = 3;
  gameState.score = 0;
  gameState.level = 1;
  gameState.gameOver = false;
}
