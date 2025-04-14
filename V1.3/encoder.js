// Chirpstack v4
function encodeDownlink(input) {
  var encoded = inbiotDeviceDecode(input.data);
  return { bytes: encoded };
}

// Chirpstack v3 and Milesight
function Encode(fPort, input) {
  return inbiotDeviceDecode(input);
}

// The Things Network
function Encoder(input, fPort) {
  return inbiotDeviceDecode(input);
}

// Main encoder function
function inbiotDeviceDecode(payload) {
  var encoded = [];

  if ("ledEnable" in payload) {
    encoded = encoded.concat(setLedEnable(payload.ledEnable));
  }
  if ("sendPeriodicity" in payload) {
    encoded = encoded.concat(setSendPeriodicity(payload.sendPeriodicity));
  }
  if ("co2Calibration" in payload) {
    encoded = encoded.concat(setCo2Calibration(payload.co2Calibration));
  }
  if ("ledConfiguration" in payload) {
    encoded = encoded.concat(setLedConfiguration(payload.ledConfiguration));
  }
  if ("touchEnable" in payload) {
    encoded = encoded.concat(setTouchEnable(payload.touchEnable));
  }
  return encoded;
}

/**
 *
 * @param {number} ledEnable value: (true/false)
 * @description This function encodes the ledEnable value into a byte array.
 * * Possible values:
 * * * true: LED enabled
 * * * false: LED disabled
 * @example { "ledEnable": true }
 */
function setLedEnable(ledEnable) {
  if (typeof ledEnable !== "boolean") {
    throw new Error("ledEnable must be a boolean value.");
  }
  return [0x01, 0x01, ledEnable ? 0x01 : 0x00];
}

/**
 *
 * @param {number} sendPeriodicity value: (0-60)
 * @description This function encodes the sendPeriodicity value into a byte array.
 * * Possible values:
 * * * 0: Default periodicity (every 15 minutes)
 * * * 1 - 60: Custom periodicity in minutes
 * @example { "sendPeriodicity": 0 }
 */
function setSendPeriodicity(sendPeriodicity) {
  if (
    typeof sendPeriodicity !== "number" ||
    sendPeriodicity < 0 ||
    sendPeriodicity > 60
  ) {
    throw new Error("sendPeriodicity must be a number between 0 and 60.");
  }
  if (sendPeriodicity === 0) {
    return [0x02, 0x01, 0xf];
  } else {
    return [0x02, 0x01, sendPeriodicity];
  }
}

/**
 * Function to encode co2Calibration
 * @param {number} co2Calibration value: (1-5)
 * @description This function encodes the co2Calibration value into a byte array.
 * * Possible values:
 * * 1: Calibration every 48 hours
 * * 2: Calibration every 24 hours
 * * 3: Calibration every 7 days
 * * 4: Calibration every 15 days
 * * 5: No calibration
 * @example { "co2Calibration": 1 }
 */
function setCo2Calibration(co2Calibration) {
  if (
    typeof co2Calibration !== "number" ||
    co2Calibration < 1 ||
    co2Calibration > 5
  ) {
    throw new Error("co2Calibration must be a number between 1 and 5.");
  }
  return [0x03, 0x01, co2Calibration];
}

/**
 *
 * @param {number} ledConfiguration value: (0-15)
 * @description This function encodes the ledConfiguration value into a byte array.
 * * Possible values:
 * * * 0: Ventilation indicator (default configuration)
 * * * 1: Confort indicator
 * * * 2: Temperature indicator
 * * * 3: Humidity indicator
 * * * 4: CO2 indicator
 * * * 5: VOCS indicator
 * * * 6: PM2.5 indicator
 * * * 7: PM10 indicator
 * * * 8: Virus indicator
 * * * 9: IAQ indicator
 * * * 10: PM1.0 indicator
 * * * 11: PM4 indicator
 * * * 12: CH2O indicator
 * * * 13: O3 indicator
 * * * 14: NO2 indicator
 * * * 15: CO indicator
 * @example { "ledConfiguration": 0 }
 */
function setLedConfiguration(ledConfiguration) {
  if (
    typeof ledConfiguration !== "number" ||
    ledConfiguration < 0 ||
    ledConfiguration > 15
  ) {
    throw new Error("ledConfiguration must be a number between 0 and 15.");
  }
  return [0x04, 0x01, ledConfiguration];
}

/**
 *
 * @param {number} touchEnable value: (true/false)
 * @description This function encodes the touchEnable value into a byte array.
 * * * Possible values:
 * * * true: Touch enabled
 * * * false: Touch disabled
 * @example { "touchEnable": true }
 */
function setTouchEnable(touchEnable) {
  if (typeof touchEnable !== "boolean") {
    throw new Error("touchEnable must be a boolean value.");
  }
  return [0x05, 0x01, touchEnable ? 0x01 : 0x00];
}

// Buffer class for encoding
function CustomBuffer(size) {
  this.buffer = new Array(size);
  this.offset = 0;

  for (var i = 0; i < size; i++) {
    this.buffer[i] = 0;
  }
}

