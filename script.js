const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const healthEl = document.getElementById("health");

let score = 0;
let health = 100;
let enemies = [];
let bullets = [];
let keys = {};
let loop, spawner;

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);
game.addEventListener("click", shoot);

function startGame() {
  clearInterval(loop);
  clearInterval(spawner);
  game.innerHTML = `<div id="crosshair">+</div>`;

  score = 0;
  health = 100;
  enemies = [];
  bullets = [];

  updateHUD();

  loop = setInterval(update, 16);
  spawner = setInterval(spawnEnemy, 900);
}

function spawnEnemy() {
  const e = document.createElement("div");
  e.className = "enemy";
  e.x = Math.random() * (window.innerWidth - 60);
  e.y = -60;
  e.speed = 1 + Math.random() * 2;
  e.style.left = e.x + "px";
  e.style.top = e.y + "px";
  game.appendChild(e);
  enemies.push(e);
}

function shoot(e) {
  const b = document.createElement("div");
  b.className = "bullet";
  b.x = e.clientX;
  b.y = window.innerHeight * 0.7;
  b.speed = 12;
  b.style.left = b.x + "px";
  b.style.top = b.y + "px";
  game.appendChild(b);
  bullets.push(b);
}

function update() {
  moveBullets();
  moveEnemies();
}

function moveBullets() {
  bullets.forEach((b, i) => {
    b.y -= b.speed;
    b.style.top = b.y + "px";

    if (b.y < -20) {
      game.removeChild(b);
      bullets.splice(i, 1);
    }
  });
}

function moveEnemies() {
  enemies.forEach((e, ei) => {
    e.y += e.speed;
    e.style.top = e.y + "px";

    bullets.forEach((b, bi) => {
      if (collide(b, e)) {
        game.removeChild(e);
        game.removeChild(b);
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score += 10;
        updateHUD();
      }
    });

    if (e.y > window.innerHeight * 0.75) {
      game.removeChild(e);
      enemies.splice(ei, 1);
      health -= 10;
      updateHUD();
      if (health <= 0) endGame();
    }
  });
}

function collide(a, b) {
  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();
  return !(
    ar.bottom < br.top ||
    ar.top > br.bottom ||
    ar.right < br.left ||
    ar.left > br.right
  );
}

function updateHUD() {
  scoreEl.textContent = score;
  healthEl.textContent = health;
}

function endGame() {
  clearInterval(loop);
  clearInterval(spawner);
  alert("Game Over! Score: " + score);
}
