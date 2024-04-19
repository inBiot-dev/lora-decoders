function Decoder(buffer) {
  const decoded = {};

  switch (buffer[0]) {
    case 0:
      decoded.timeToSend = buffer[1];
      decoded.ventilation = buffer[2];
      decoded.ledStatus = buffer[3] ? "true" : "false";
      break;
    case 1:
      decoded.type = customTextDecoder(buffer, 27, 31);
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
        decoded.temperature = getUint16(buffer, 1, 2) / 10.0;
        decoded.humidity = getUint16(buffer, 3, 4) / 10.0;
        decoded.co2 = getUint16(buffer, 5, 6);

        if (decoded.type !== "MINI") {
          decoded.tvoc = getUint16(buffer, 9, 10);
          decoded.pm2_5 = getUint16(buffer, 13, 14);
          decoded.pm10 = getUint16(buffer, 17, 18);
        }
        if (
          decoded.type === "PLUS" ||
          decoded.type === "WELL" ||
          decoded.type === "NULL"
        ) {
          decoded.ch2o = getUint16(buffer, 7, 8);
          decoded.pm1_0 = getUint16(buffer, 11, 12);
          decoded.pm4 = getUint16(buffer, 15, 16);
        }
        if (decoded.type === "WELL" || decoded.type === "NULL") {
          decoded.o3 = getUint16(buffer, 19, 20);
          if (decoded.o3 === 0xffff) {
            decoded.o3 = "Preheating";
          }
          decoded.no2 = getUint16(buffer, 21, 22);
          if (decoded.no2 === 0xffff) {
            decoded.no2 = "Preheating";
          }
          decoded.co = getUint16(buffer, 23, 24);
          if (decoded.co !== 0xffff) {
            decoded.co /=  10.0;
          } else {
            decoded.co = "Preheating";
          }
        }
        decoded.vIndex = buffer[32];
        decoded.counter = getUint16(buffer, 25, 26);
      }
      break;
    case 2:
      decoded.fwVersion = customTextDecoder(buffer, 1, 4);
      decoded.model = customTextDecoder(buffer, 4, 21);
      decoded.micaType = customTextDecoder(buffer, 21, 30);
      decoded.mac = buffer
        .slice(30, 36)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(":")
        .toUpperCase();
      decoded.modbusAddress = buffer[36];
      decoded.modbusParity = buffer[37];
      decoded.modbusBaudRate = getUint32(buffer, 38);
      break;
    default:
  }
  return decoded;
}

function customTextDecoder(buffer, start, end) {
  let result = "";
  for (let i = start; i < end; i++) {
    result += String.fromCharCode(buffer[i]);
  }
  return result;
}

function getUint16(buffer, first, second) {
  let result = "";
  result = (buffer[first] << 8) | buffer[second];
  return result;
}

function getUint32(buffer, start) {
  let result = 0;
  result =
    (buffer[start] << 24) |
    (buffer[start + 1] << 16) |
    (buffer[start + 2] << 8) |
    buffer[start + 3];
  return result;
}
