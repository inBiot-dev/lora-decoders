/**
 * build-akenza.js — builds Akenza uplink.js and downlink.js for all 4 inBiot models.
 *
 * The 4 uplink.js files (mica/mini/plus/well) are identical in Akenza — the decoder
 * reads the device type from the payload. Same for downlink.js.
 *
 * uplink.js structure:
 *   consume(event) wrapper  ← from templates/akenza-uplink-wrapper.js (static)
 *   InbiotDeviceDecode()    ← from templates/akenza-core-decode.js (MANUALLY MAINTAINED)
 *   helper functions        ← extracted from V1.3/decoder.js (auto-updated)
 *
 * downlink.js structure:
 *   consume(event) wrapper  ← from templates/akenza-downlink-wrapper.js (static)
 *   inbiotDeviceDecode()    ← extracted from V1.3/encoder.js (auto-updated)
 *   setX helpers            ← from templates/akenza-downlink-helpers.js (MANUALLY MAINTAINED)
 *
 * Usage: TARGET_DIR=../lorawan-akenza/types/inbiot node sync/build-akenza.js
 */
const fs = require("fs");
const path = require("path");
const { extractFunction, extractAfterFunction } = require("./extract-core.js");

const repoRoot = path.resolve(__dirname, "..");
const templatesDir = path.join(__dirname, "templates");
const targetDir = process.env.TARGET_DIR
  ? path.resolve(process.env.TARGET_DIR)
  : path.resolve(repoRoot, "../lorawan-akenza/types/inbiot");

if (!fs.existsSync(targetDir)) {
  console.error("ERROR: Target directory does not exist: " + targetDir);
  process.exit(1);
}

const decoderSrc = fs.readFileSync(path.join(repoRoot, "V1.3", "decoder.js"), "utf8");
const encoderSrc = fs.readFileSync(path.join(repoRoot, "V1.3", "encoder.js"), "utf8");

const uplinkWrapper = fs.readFileSync(path.join(templatesDir, "akenza-uplink-wrapper.js"), "utf8");
const coreDecodeTemplate = fs.readFileSync(path.join(templatesDir, "akenza-core-decode.js"), "utf8");
const downlinkWrapper = fs.readFileSync(path.join(templatesDir, "akenza-downlink-wrapper.js"), "utf8");
const downlinkHelpers = fs.readFileSync(path.join(templatesDir, "akenza-downlink-helpers.js"), "utf8");

// Extract decoder helpers from source (byte math, MAC, region lookup — no field names)
const decoderHelpers = extractAfterFunction(decoderSrc, "InbiotDeviceDecode");

// Extract encoder dispatcher from source (the if/in payload block)
const encodeDispatcher = extractFunction(encoderSrc, "inbiotDeviceDecode");

// Build uplink.js: wrapper + Akenza core (manual template) + auto-updated helpers
const uplinkOutput = [
  uplinkWrapper,
  coreDecodeTemplate,
  "",
  decoderHelpers,
].join("\n");

// Build downlink.js: wrapper + auto-updated dispatcher + manual helpers
const downlinkOutput = [
  downlinkWrapper,
  "// Main encoder function",
  encodeDispatcher,
  "",
  downlinkHelpers,
].join("\n");

const models = ["mica", "mini", "plus", "well"];
for (const model of models) {
  const modelDir = path.join(targetDir, model);
  if (!fs.existsSync(modelDir)) {
    console.warn("WARNING: Model directory not found, skipping: " + modelDir);
    continue;
  }

  const uplinkPath = path.join(modelDir, "uplink.js");
  const downlinkPath = path.join(modelDir, "downlink.js");

  fs.writeFileSync(uplinkPath, uplinkOutput, "utf8");
  fs.writeFileSync(downlinkPath, downlinkOutput, "utf8");
  console.log("Written: " + model + "/uplink.js, " + model + "/downlink.js");
}

console.log("Akenza build complete.");
