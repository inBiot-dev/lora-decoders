# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

LoRaWAN payload codecs (JavaScript) for inBiot MICA indoor air quality devices (models MINI, MICA, PLUS, WELL). Each version folder targets a firmware range; **only V1.3 is actively maintained** (FW 2.6+). Older folders (V1.0–V1.2) are frozen for legacy firmware and use a single `payload.js`. Main branch is `develop`.

- `V1.3/decoder.js` — uplink decoder
- `V1.3/encoder.js` — downlink encoder (also `decodeDownlink` for TTN)
- `V1.3/README.md` — payload field documentation (update it when fields change)
- `sync/` — Node build scripts that transform V1.3 for external integration repos
- `.github/workflows/sync-integrations.yml` — on push to `develop` touching `V1.3/*.js`, auto-opens PRs in the TTN, Actility, and Akenza fork repos (MiguelFerrerF/lorawan-TTN, lorawan-actility, lorawan-akenza)

## Codec architecture

Plain ES5 JavaScript, no dependencies, no build step for the codecs themselves — the same file must run on all LNS platforms. Each file exposes thin per-platform wrappers around one core function:

- Decoder: `decodeUplink` (ChirpStack v4) / `Decode` (ChirpStack v3, Milesight) / `Decoder` (TTN) → all call `InbiotDeviceDecode(bytes)`
- Encoder: `encodeDownlink` / `Encode` / `Encoder` → all call `inbiotDeviceDecode(payload)` (note lowercase `i`; the sync scripts extract functions **by exact name**, so do not rename them)

`InbiotDeviceDecode` dispatches on `bytes[0]` (message type): `0` = configuration, `1` = device information (MAC, FW version, model, Modbus), `2` = IAQ data. Sentinel values mark sensor states: `0xFF` / `0xFFFF` mean "Preheating"/"Calculating"/not available for optional sensors (noise, moldIndex, o3, no2, co, ch2o).

The encoder maps JSON fields to downlink bytes via `setX()` helpers (`setLedEnable`, `setSendPeriodicity`, `setCo2Calibration`, `setLedConfiguration`, `setTouchEnable`, ...), selected by `if ('field' in payload)` checks inside `inbiotDeviceDecode`.

## Sync build scripts

```bash
cd sync
npm run build:ttn        # verbatim copy to TTN fork (TARGET_DIR env var)
npm run build:actility   # extracts core + wraps with sync/templates/actility-*
npm run build:akenza     # per-model uplink/downlink from sync/templates/akenza-*
```

Each script takes `TARGET_DIR` pointing at a local checkout of the corresponding fork. `sync/extract-core.js` pulls functions out of the V1.3 sources by name using brace counting.

## Tests

No tests live in this repo. Tests run in the target repos during the sync workflow:
- Syntax check: `node --check V1.3/decoder.js` (and encoder.js)
- Actility: `node test.js` in `lorawan-actility/vendors/inbiot/drivers/inbiot-decoder` (cases in its `examples.json`)
- Akenza: `npx mocha "types/inbiot/*/uplink.spec.js" "types/inbiot/*/downlink.spec.js"` in lorawan-akenza

## Checklist when changing V1.3 (from the sync workflow)

Adding/modifying a **sensor field** in decoder.js:
1. Update `sync/templates/akenza-core-decode.js` (Akenza uses different field names: `pm1_0`→`pm1`, `dB`→`noise`; preheating states become a separate `*Status` field and the raw value is removed)
2. Add test cases in lorawan-actility `examples.json`
3. Update Mocha tests in lorawan-akenza `types/inbiot/*`
4. TTN and Actility outputs are generated automatically; Akenza uses the manual template

Adding a **downlink command** in encoder.js:
1. Add the `setX()` handler and the `if ('field' in payload)` branch in `inbiotDeviceDecode()`
2. Update `sync/templates/akenza-downlink-helpers.js`
3. Add a downlink example in lorawan-actility `examples.json`

## Conventions

- ES5 only (`var`, no arrow functions, no template literals) — LNS JavaScript engines are restrictive
- Do not modify V1.0–V1.2; version changes go in a new folder if a firmware range breaks compatibility
- Keep `V1.3/README.md` field tables and the root `README.md` version table in sync with code changes
