/**
 * build-ttn.js — copies V1.3/decoder.js and encoder.js verbatim to the TTN fork.
 * TTN uses the files as-is (they already contain all platform wrappers).
 *
 * Usage: TARGET_DIR=../lorawan-TTN/vendor/inbiot node sync/build-ttn.js
 */
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const targetDir = process.env.TARGET_DIR
  ? path.resolve(process.env.TARGET_DIR)
  : path.resolve(repoRoot, "../lorawan-TTN/vendor/inbiot");

if (!fs.existsSync(targetDir)) {
  console.error("ERROR: Target directory does not exist: " + targetDir);
  process.exit(1);
}

const files = ["decoder.js", "encoder.js"];
for (const file of files) {
  const src = path.join(repoRoot, "V1.3", file);
  const dst = path.join(targetDir, file);
  fs.copyFileSync(src, dst);
  console.log("Copied: " + file + " → " + dst);
}

console.log("TTN build complete.");
