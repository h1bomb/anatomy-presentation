import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

test("Vite React build produces code-split SPA with instant dark loading screen", () => {
  const root = join(import.meta.dirname, "..");
  const distDir = join(root, "dist");
  const indexPath = join(distDir, "index.html");
  const brollPath = join(distDir, "broll-player.html");

  if (!existsSync(indexPath) || !existsSync(brollPath)) {
    execSync("npm run build", { cwd: root, stdio: "pipe" });
  }

  assert.ok(existsSync(indexPath), "dist/index.html must exist");
  assert.ok(existsSync(brollPath), "dist/broll-player.html must exist");

  const html = readFileSync(indexPath, "utf8");
  assert.ok(html.includes("pre-loader-cover"), "index.html must contain instant loading indicator");
  assert.ok(html.includes("ANATOMY · B-ROLL PLAYER"), "index.html must brand loading screen");
  assert.ok(html.includes("/src/main.tsx") || html.includes("/assets/"), "index.html must reference Vite bundle");

  const stat = statSync(indexPath);
  assert.ok(stat.size < 10000, `dist/index.html must be lightweight (<10KB), got ${stat.size} bytes`);

  const assetsDir = join(distDir, "assets");
  assert.ok(existsSync(assetsDir), "dist/assets must exist");
  const files = readdirSync(assetsDir);

  // Must have code-split chunks
  assert.ok(files.some((f) => f.startsWith("watch-") && f.endsWith(".js")), "watch figure must be split");
  assert.ok(files.some((f) => f.startsWith("turbofan-") && f.endsWith(".js")), "turbofan figure must be split");
  assert.ok(files.some((f) => f.startsWith("vendor-react-") && f.endsWith(".js")), "react must be in vendor chunk");

  // Must NOT contain the 20MB monolithic bundle
  assert.ok(!files.includes("official-figures-bundle.js"), "20MB monolithic bundle must be removed");
});
