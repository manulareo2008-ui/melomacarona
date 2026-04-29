import { rm } from "node:fs/promises";
import { join } from "node:path";

async function clean() {
  const nextDir = join(process.cwd(), ".next");
  await rm(nextDir, { recursive: true, force: true });
  console.log("Cleaned .next cache directory");
}

clean().catch((error) => {
  console.error("Failed to clean .next:", error);
  process.exitCode = 1;
});
