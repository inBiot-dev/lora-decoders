// Chirpstack v4
function decodeUplink(input) {
  var decoded = InbiotDeviceDecode(input.bytes);
  return { data: decoded };
}

// Chirpstack v3
function Decode(fPort, bytes) {
  return InbiotDeviceDecode(bytes);
}

// The Things Network
function Decoder(bytes, port) {
  return InbiotDeviceDecode(bytes);
}

function InbiotDeviceDecode(bytes) {
  const decoded = {};

  switch (bytes[0]) {
    case 0:
      // TIME TO SEND
      decoded.timeToSend = bytes[1];
      // VENTILATION TYPE
      decoded.ventilation = bytes[2];
      // LED CONFIGURATION
      decoded.ledStatus = bytes[3] ? "true" : "false";
      break;
    case 1:
      // MICA TYPE
      decoded.type = customTextDecoder(bytes, 27, 31);
      if (decoded.type === "\u0000\u0000\u0000\u0000") {
        decoded.type = "NULL";
      }
      const typeProperties = {
        MINI: true,
        MICA: true,
        PLUS: true,
        WELL: true,
        NULL: true,
      };
      if (typeProperties[decoded.type]) {
        // TEMPERATURE
        decoded.temperature = getUint16(bytes, 1, 2) / 10.0;
        // HUMIDITY
        decoded.humidity = getUint16(bytes, 3, 4) / 10.0;
        // CO2
        decoded.co2 = getUint16(bytes, 5, 6);

        if (decoded.type !== "MINI") {
          // TVOC
          decoded.tvoc = getUint16(bytes, 9, 10);
          // PM2.5
          decoded.pm2_5 = getUint16(bytes, 13, 14);
          // PM10
          decoded.pm10 = getUint16(bytes, 17, 18);
        }
        if (
          decoded.type === "PLUS" ||
          decoded.type === "WELL" ||
          decoded.type === "NULL"
        ) {
          // CH2O
          decoded.ch2o = getUint16(bytes, 7, 8);
          // PM1.0
          decoded.pm1_0 = getUint16(bytes, 11, 12);
          // PM4
          decoded.pm4 = getUint16(bytes, 15, 16);
        }
        if (decoded.type === "WELL" || decoded.type === "NULL") {
          // O3
          decoded.o3 = getUint16(bytes, 19, 20);
          if (decoded.o3 === 0xffff) {
            decoded.o3 = "Preheating";
          }
          // NO2
          decoded.no2 = getUint16(bytes, 21, 22);
          if (decoded.no2 === 0xffff) {
            decoded.no2 = "Preheating";
          }
          // CO
          decoded.co = getUint16(bytes, 23, 24);
          if (decoded.co !== 0xffff) {
            decoded.co /= 10.0;
          } else {
            decoded.co = "Preheating";
          }
        }
        // VENTILATION INDEX
        decoded.vIndex = bytes[32];
        // MESSAGE COUNTER
        decoded.counter = getUint16(bytes, 25, 26);
      }
      break;
    case 2:
      // FIRMWARE VERSION
      decoded.fwVersion = customTextDecoder(bytes, 1, 4);
      // MODEL
      decoded.model = customTextDecoder(bytes, 4, 21);
      // MICA TYPE
      decoded.micaType = customTextDecoder(bytes, 21, 30);
      // MAC ADDRESS
      decoded.mac = bytes
        .slice(30, 36)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(":")
        .toUpperCase();
      // ----- ONLY MODBUS CONFIGURATION -----

      // MODBUS ADDRESS
      decoded.modbusAddress = bytes[36];
      // MODBUS PARITY
      decoded.modbusParity = bytes[37];
      // MODBUS BAUD RATE
      decoded.modbusBaudRate = getUint32(bytes, 38);
      break;
    default:
  }
  return decoded;
}

function customTextDecoder(bytes, start, end) {
  let result = "";
  for (let i = start; i < end; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return result;
}

function getUint16(bytes, first, second) {
  let result = "";
  result = (bytes[first] << 8) | bytes[second];
  return result;
}

function getUint32(bytes, start) {
  let result = 0;
  result =
    (bytes[start] << 24) |
    (bytes[start + 1] << 16) |
    (bytes[start + 2] << 8) |
    bytes[start + 3];
  return result;
}

