/**
 * build-actility.js — transforms V1.3/decoder.js + encoder.js into the Actility
 * index.js format and writes it to the Actility fork.
 *
 * Actility format:
 *   decodeUplink(input)   → calls InbiotDeviceDecodeUplink(input.bytes)
 *   encodeDownlink(input) → calls InbiotDeviceDecodeDownlink(input)
 *   decodeDownlink(input) → passthrough
 *   + module.exports
 *
 * Usage: TARGET_DIR=../lorawan-actility/vendors/inbiot/drivers/inbiot-decoder node sync/build-actility.js
 */
const fs = require("fs");
const path = require("path");
const { extractFunction, extractAfterFunction } = require("./extract-core.js");

const repoRoot = path.resolve(__dirname, "..");
const templatesDir = path.join(__dirname, "templates");
const targetDir = process.env.TARGET_DIR
  ? path.resolve(process.env.TARGET_DIR)
  : path.resolve(repoRoot, "../lorawan-actility/vendors/inbiot/drivers/inbiot-decoder");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log("Created target directory: " + targetDir);
}

const decoderSrc = fs.readFileSync(path.join(repoRoot, "V1.3", "decoder.js"), "utf8");
const encoderSrc = fs.readFileSync(path.join(repoRoot, "V1.3", "encoder.js"), "utf8");
const wrapper = fs.readFileSync(path.join(templatesDir, "actility-wrapper.js"), "utf8");
const moduleExports = fs.readFileSync(path.join(templatesDir, "actility-module-exports.js"), "utf8");

// Extract and rename main decode function
const decodeFunc = extractFunction(decoderSrc, "InbiotDeviceDecode")
  .replace("function InbiotDeviceDecode(", "function InbiotDeviceDecodeUplink(");

// Extract decoder helpers (everything after InbiotDeviceDecode)
const decoderHelpers = extractAfterFunction(decoderSrc, "InbiotDeviceDecode");

// Extract and rename main encode function
const encodeFunc = extractFunction(encoderSrc, "inbiotDeviceDecode")
  .replace("function inbiotDeviceDecode(", "function InbiotDeviceDecodeDownlink(");

// Extract encoder helpers (everything after inbiotDeviceDecode)
const encoderHelpers = extractAfterFunction(encoderSrc, "inbiotDeviceDecode");

const output = [
  wrapper,
  decodeFunc,
  "",
  encodeFunc,
  "",
  decoderHelpers,
  encoderHelpers,
  moduleExports,
].join("\n");

const outPath = path.join(targetDir, "index.js");
fs.writeFileSync(outPath, output, "utf8");
console.log("Written: " + outPath);
console.log("Actility build complete.");
