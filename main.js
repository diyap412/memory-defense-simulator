import { safeMemAccess, faultLog, resetFaults, regions } from "./mpu.js";
import { gameState, resetGame } from "./game.js";
import { cpu, resetCPU } from "./cpu.js";

const status = document.getElementById("status");
const grid = document.getElementById("memoryGrid");

function updateStatus() {
  if (gameState.health <= 0) gameState.gameOver = true;
  if (gameState.score >= 100) gameState.level = 2;
  if (gameState.score >= 200) gameState.level = 3;

  status.textContent = `
Mode: ${cpu.mode}
Level: ${gameState.level}
Health: ${gameState.health}
Score: ${gameState.score}

Faults: ${faultLog.count}
Last Fault Address: ${faultLog.lastAddress}
`;
}

function attempt(addr) {
  if (gameState.gameOver) return;

  try {
    safeMemAccess(addr, "WRITE", 0xAA);
    gameState.score += 10;
  } catch {
    gameState.health--;
  }
  drawMemory(addr);
  updateStatus();
}

function drawMemory(activeAddr = null) {
  grid.innerHTML = "";
  for (let i = 0; i < 1024; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (i >= regions.user.start && i <= regions.user.end) cell.classList.add("user");
    else if (i >= regions.kernel.start && i <= regions.kernel.end) cell.classList.add("kernel");
    else if (i >= regions.protected.start && i <= regions.protected.end) cell.classList.add("protected");

    if (i === activeAddr) cell.classList.add("active");
    grid.appendChild(cell);
  }
}

document.getElementById("btnUser").onclick = () => attempt(0x0210);
document.getElementById("btnKernel").onclick = () => attempt(0x0310);
document.getElementById("btnProtected").onclick = () => attempt(0x0350);

document.getElementById("btnKernelMode").onclick = () => {
  cpu.mode = "KERNEL";
  updateStatus();
};

document.getElementById("btnReset").onclick = () => {
  resetGame();
  resetCPU();
  resetFaults();
  drawMemory();
  updateStatus();
};

drawMemory();
updateStatus();
