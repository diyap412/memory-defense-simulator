const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

let playerX = 230;
let score = 0;
let lives = 3;
let bullets = [];
let enemies = [];
let gameLoopInterval;
let enemySpawnInterval;

const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function startGame() {
  clearInterval(gameLoopInterval);
  clearInterval(enemySpawnInterval);

  game.innerHTML = "";
  game.appendChild(player);

  playerX = 230;
  score = 0;
  lives = 3;
  bullets = [];
  enemies = [];

  updateHUD();

  gameLoopInterval = setInterval(gameLoop, 20);
  enemySpawnInterval = setInterval(spawnEnemy, 800);
}

function gameLoop() {
  movePlayer();
  moveBullets();
  moveEnemies();
  checkCollisions();
}

function movePlayer() {
  if ((keys["ArrowLeft"] || keys["a"]) && playerX > 0) playerX -= 6;
  if ((keys["ArrowRight"] || keys["d"]) && playerX < 460) playerX += 6;
  if (keys[" "] && bullets.length < 5) shoot();

  player.style.left = playerX + "px";
}

function shoot() {
  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = playerX + 17 + "px";
  bullet.style.bottom = "60px";
  game.appendChild(bullet);
  bullets.push(bullet);
}

function moveBullets() {
  bullets.forEach((b, i) => {
    b.style.bottom = b.offsetBottom + 8 + "px";
    if (b.offsetBottom > 600) {
      game.removeChild(b);
      bullets.splice(i, 1);
    }
  });
}

function spawnEnemy() {
  const enemy = document.createElement("div");
  enemy.className = "enemy";
  enemy.style.left = Math.floor(Math.random() * 10) * 50 + "px";
  enemy.style.top = "0px";
  game.appendChild(enemy);
  enemies.push(enemy);
}

function moveEnemies() {
  enemies.forEach((e, i) => {
    e.style.top = e.offsetTop + 3 + "px";
    if (e.offsetTop > 560) {
      game.removeChild(e);
      enemies.splice(i, 1);
      lives--;
      updateHUD();
      if (lives === 0) endGame();
    }
  });
}

function checkCollisions() {
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (collision(b, e)) {
        game.removeChild(b);
        game.removeChild(e);
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score += 10;
        updateHUD();
      }
    });
  });
}

function collision(a, b) {
  return !(
    a.offsetTop + a.offsetHeight < b.offsetTop ||
    a.offsetTop > b.offsetTop + b.offsetHeight ||
    a.offsetLeft + a.offsetWidth < b.offsetLeft ||
    a.offsetLeft > b.offsetLeft + b.offsetWidth
  );
}

function updateHUD() {
  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
}

function endGame() {
  clearInterval(gameLoopInterval);
  clearInterval(enemySpawnInterval);
  alert("Game Over! Score: " + score);
}