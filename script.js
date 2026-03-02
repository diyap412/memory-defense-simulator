const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const waveEl = document.getElementById("wave");
const pauseOverlay = document.getElementById("pauseOverlay");

let playerX, score, lives, wave;
let bullets = [], enemies = [], powerups = [];
let gameLoop, enemySpawner;
let paused = false;
let fireCooldown = 300;
let canShoot = true;

const keys = {};
document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (e.key === "p") togglePause();
});
document.addEventListener("keyup", e => keys[e.key] = false);

function startGame() {
  clearInterval(gameLoop);
  clearInterval(enemySpawner);
  game.innerHTML = "";
  game.appendChild(player);
  game.appendChild(pauseOverlay);

  playerX = 230;
  score = 0;
  lives = 3;
  wave = 1;
  bullets = [];
  enemies = [];
  powerups = [];
  paused = false;

  updateHUD();

  gameLoop = setInterval(loop, 20);
  enemySpawner = setInterval(spawnEnemy, 900);
}

function loop() {
  if (paused) return;
  movePlayer();
  moveBullets();
  moveEnemies();
  movePowerups();
  checkWave();
}

function movePlayer() {
  if ((keys["a"] || keys["ArrowLeft"]) && playerX > 0) playerX -= 6;
  if ((keys["d"] || keys["ArrowRight"]) && playerX < 460) playerX += 6;
  if (keys[" "] && canShoot) shoot();
  player.style.left = playerX + "px";
}

function shoot() {
  canShoot = false;
  setTimeout(() => canShoot = true, fireCooldown);

  const b = document.createElement("div");
  b.className = "bullet";
  b.style.left = playerX + 17 + "px";
  b.style.bottom = "60px";
  game.appendChild(b);
  bullets.push(b);
}

function spawnEnemy() {
  const e = document.createElement("div");
  e.className = "enemy";

  const roll = Math.random();
  e.hp = 1;
  e.speed = 2;

  if (roll > 0.8) { e.classList.add("tank"); e.hp = 3; e.speed = 1; }
  else if (roll > 0.6) { e.classList.add("fast"); e.speed = 4; }

  e.style.left = Math.floor(Math.random() * 10) * 50 + "px";
  e.style.top = "0px";
  game.appendChild(e);
  enemies.push(e);
}

function moveBullets() {
  bullets.forEach((b, bi) => {
    b.style.bottom = b.offsetBottom + 10 + "px";
    if (b.offsetBottom > 600) {
      game.removeChild(b);
      bullets.splice(bi, 1);
    }
  });
}

function moveEnemies() {
  enemies.forEach((e, ei) => {
    e.style.top = e.offsetTop + e.speed + "px";

    bullets.forEach((b, bi) => {
      if (hit(b, e)) {
        e.hp--;
        game.removeChild(b);
        bullets.splice(bi, 1);
        if (e.hp <= 0) destroyEnemy(e, ei);
      }
    });

    if (e.offsetTop > 560) {
      game.removeChild(e);
      enemies.splice(ei, 1);
      lives--;
      updateHUD();
      if (lives <= 0) endGame();
    }
  });
}

function destroyEnemy(e, index) {
  game.removeChild(e);
  enemies.splice(index, 1);
  score += 10;
  if (Math.random() < 0.2) spawnPowerup(e.offsetLeft);
  updateHUD();
}

function spawnPowerup(x) {
  const p = document.createElement("div");
  p.className = "powerup";
  p.style.left = x + "px";
  p.style.top = "0px";
  p.type = Math.random() > 0.5 ? "rapid" : "life";
  game.appendChild(p);
  powerups.push(p);
}

function movePowerups() {
  powerups.forEach((p, pi) => {
    p.style.top = p.offsetTop + 3 + "px";
    if (hit(p, player)) {
      if (p.type === "rapid") fireCooldown = 120;
      if (p.type === "life") lives++;
      game.removeChild(p);
      powerups.splice(pi, 1);
      updateHUD();
    }
  });
}

function checkWave() {
  if (score >= wave * 150) {
    wave++;
    fireCooldown = Math.max(100, fireCooldown - 20);
    updateHUD();
  }
}

function togglePause() {
  paused = !paused;
  pauseOverlay.style.display = paused ? "flex" : "none";
}

function hit(a, b) {
  return !(
    a.offsetTop + a.offsetHeight < b.offsetTop ||
    a.offsetTop > b.offsetTop + b.offsetHeight ||
    a.offsetLeft + a.offsetWidth < b.offsetLeft ||
    a.offsetLeft > b.offsetLeft + b.offsetWidth
  );
}

function updateHUD() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  waveEl.textContent = wave;
}

function endGame() {
  clearInterval(gameLoop);
  clearInterval(enemySpawner);
  alert("Game Over! Score: " + score);
}
