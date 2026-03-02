import { cpu } from "./cpu.js";

export const regions = {
  user: { start: 0x0200, end: 0x02FF },
  kernel: { start: 0x0300, end: 0x033F },
  protected: { start: 0x0340, end: 0x03FF }
};

export const faultLog = {
  count: 0,
  lastAddress: null,
  lastType: null
};

export function safeMemAccess(addr, type, value = 0) {
  if (addr >= regions.protected.start && addr <= regions.protected.end) {
    fault(addr, type);
  }

  if (addr >= regions.kernel.start && addr <= regions.kernel.end) {
    if (cpu.mode !== "KERNEL") fault(addr, type);
  }

  if (type === "WRITE") cpu.memory[addr] = value;
}

function fault(addr, type) {
  faultLog.count++;
  faultLog.lastAddress = addr;
  faultLog.lastType = type;
  throw new Error("MPU FAULT");
}

export function resetFaults() {
  faultLog.count = 0;
  faultLog.lastAddress = null;
  faultLog.lastType = null;
}
