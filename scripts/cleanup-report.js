// scripts/cleanup-report.js
import { execSync } from "child_process";
import fs from "fs";

console.log("🔍 Running cleanup checks...");

// Run depcheck
console.log("\n--- Unused Files & Dependencies (depcheck) ---");
try {
  const depcheckOutput = execSync("npx depcheck --json", { encoding: "utf-8" });
  fs.writeFileSync("unused-deps.json", depcheckOutput);
  console.log("✅ depcheck report saved to unused-deps.json");
} catch (err) {
  console.error("depcheck failed:", err.message);
}

// Run ts-prune
console.log("\n--- Unused Exports (ts-prune) ---");
try {
  const tsPruneOutput = execSync("npx ts-prune -p tsconfig.json", { encoding: "utf-8" });
  fs.writeFileSync("unused-exports.txt", tsPruneOutput);
  console.log("✅ ts-prune report saved to unused-exports.txt");
} catch (err) {
  console.error("ts-prune failed:", err.message);
}