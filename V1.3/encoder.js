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

  if ("ledStatus" in payload) {
    encoded = encoded.concat(setLedEnable(payload.ledStatus));
  }
  if ("timeToSend" in payload) {
    encoded = encoded.concat(setSendPeriodicity(payload.timeToSend));
  }
  if ("ventilation" in payload) {
    encoded = encoded.concat(setCo2Calibration(payload.ventilation));
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
 * @param {number} ledStatus value: (true/false)
 * @description This function encodes the ledStatus value into a byte array.
 * * Possible values:
 * * * true: LED enabled
 * * * false: LED disabled
 * @example { "ledStatus": true }
 */
function setLedEnable(ledStatus) {
  if (typeof ledStatus !== "boolean") {
    throw new Error("ledStatus must be a boolean value.");
  }
  return [0x01, 0x01, ledStatus ? 0x01 : 0x00];
}

/**
 *
 * @param {number} timeToSend value: (0-60)
 * @description This function encodes the timeToSend value into a byte array.
 * * Possible values:
 * * * 0: Default periodicity (every 15 minutes)
 * * * 1 - 60: Custom periodicity in minutes
 * @example { "timeToSend": 0 }
 */
function setSendPeriodicity(timeToSend) {
  if (typeof timeToSend !== "number" || timeToSend < 0 || timeToSend > 60) {
    throw new Error("timeToSend must be a number between 0 and 60.");
  }
  if (timeToSend === 0) {
    return [0x02, 0x01, 0xf];
  } else {
    return [0x02, 0x01, timeToSend];
  }
}

/**
 * Function to encode co2Calibration
 * @param {number} ventilation value: (1-5)
 * @description This function encodes the co2Calibration value into a byte array.
 * * Possible values:
 * * 1: Calibration every 48 hours
 * * 2: Calibration every 24 hours
 * * 3: Calibration every 7 days
 * * 4: Calibration every 15 days
 * * 5: No calibration
 * @example { "ventilation": 1 }
 */
function setCo2Calibration(ventilation) {
  if (typeof ventilation !== "number" || ventilation < 1 || ventilation > 5) {
    throw new Error("ventilation must be a number between 1 and 5.");
  }
  return [0x03, 0x01, ventilation];
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
