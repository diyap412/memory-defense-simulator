export const cpu = {
  memory: new Uint8Array(1024),
  mode: "USER"
};

export function resetCPU() {
  cpu.memory.fill(0);
  cpu.mode = "USER";
}
