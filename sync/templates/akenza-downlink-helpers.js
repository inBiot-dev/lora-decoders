// MANUALLY MAINTAINED — Akenza-specific encoder helper functions.
// Differences from the TTN source encoder (V1.3/encoder.js):
//   - setSendPeriodicity: clamps timeToSend < 5 to minimum 5 min
//   - setDR: accepts 0-7 (TTN source accepts 0-5)
function setLedEnable(ledStatus) {
  if (typeof ledStatus !== "boolean") {
    throw new Error("ledStatus must be a boolean value.");
  }
  return [0x01, 0x01, ledStatus ? 0x01 : 0x00];
}

function setSendPeriodicity(timeToSend) {
  if (typeof timeToSend !== "number" || timeToSend < 0 || timeToSend > 60) {
    throw new Error("timeToSend must be a number between 0 and 60.");
  }
  if (timeToSend === 0) {
    return [0x02, 0x01, 0xf];
  } else if (timeToSend < 5) {
    return [0x02, 0x01, 0x05];
  } else {
    return [0x02, 0x01, timeToSend];
  }
}

function setCo2Calibration(ventilation) {
  if (typeof ventilation !== "number" || ventilation < 1 || ventilation > 5) {
    throw new Error("ventilation must be a number between 1 and 5.");
  }
  return [0x03, 0x01, ventilation];
}

function setLedConfiguration(ledConfiguration) {
  if (
    typeof ledConfiguration !== "number" ||
    ledConfiguration < 0 ||
    ledConfiguration > 16
  ) {
    throw new Error("ledConfiguration must be a number between 0 and 16.");
  }
  return [0x04, 0x01, ledConfiguration];
}

function setTouchEnable(touchEnable) {
  if (typeof touchEnable !== "boolean") {
    throw new Error("touchEnable must be a boolean value.");
  }
  return [0x05, 0x01, touchEnable ? 0x01 : 0x00];
}

function setADREnable(ADREnable) {
  if (typeof ADREnable !== "boolean") {
    throw new Error("ADREnable must be a boolean value.");
  }
  return [0x09, 0x01, ADREnable ? 0x01 : 0x00];
}

function setDR(DR) {
  if (typeof DR !== "number" || DR < 0 || DR > 7) {
    throw new Error("DR must be a number between 0 and 7.");
  }
  return [0x0a, 0x01, DR];
}

function setSendRetransmissions(sendRetransmissions) {
  if (
    typeof sendRetransmissions !== "number" ||
    sendRetransmissions < 0 ||
    sendRetransmissions > 15
  ) {
    throw new Error("sendRetransmissions must be a number between 0 and 15.");
  }
  return [0x0b, 0x01, sendRetransmissions];
}

function setTXPower(TXPower) {
  if (typeof TXPower !== "number" || TXPower < 0 || TXPower > 15) {
    throw new Error("TXPower must be a number between 0 and 15.");
  }
  return [0x0c, 0x01, TXPower];
}

function setConfirmationEnable(confirmationEnable) {
  if (typeof confirmationEnable !== "boolean") {
    throw new Error("confirmationEnable must be a boolean value.");
  }
  return [0x0d, 0x01, confirmationEnable ? 0x01 : 0x00];
}

function setResetDevice(resetDevice) {
  if (typeof resetDevice !== "boolean") {
    throw new Error("resetDevice must be a boolean value.");
  }
  return [0x0f, 0x01, resetDevice ? 0x01 : 0x00];
}
