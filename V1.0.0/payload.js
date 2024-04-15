function Decoder(buffer) {
  var decoded = {};
  var count = buffer[0];
  switch (count) {
    case 0:
      decoded.timeToSend = buffer[1];
      decoded.ventilation = buffer[2];
      decoded.ledStatus = buffer[3] ? "true" : "false";
      break;
    case 1:
      decoded.temperature = ((buffer[1] << 8) | buffer[2]) / 10.0;
      decoded.humidity = ((buffer[3] << 8) | buffer[4]) / 10.0;
      decoded.co2 = (buffer[5] << 8) | buffer[6];
      decoded.ch2o = (buffer[7] << 8) | buffer[8];
      decoded.tvoc = (buffer[9] << 8) | buffer[10];
      decoded.pm1_0 = (buffer[11] << 8) | buffer[12];
      decoded.pm2_5 = (buffer[13] << 8) | buffer[14];
      decoded.pm4 = (buffer[15] << 8) | buffer[16];
      decoded.pm10 = (buffer[17] << 8) | buffer[18];
      decoded.o3 = (buffer[19] << 8) | buffer[20];
      decoded.no2 = (buffer[21] << 8) | buffer[22];
      decoded.co = (buffer[23] << 8) | (buffer[24] / 10.0);
      decoded.counter = (buffer[25] << 8) | buffer[26];
      break;
    case 2:
      let arrayVersion = new Uint8Array([buffer[1], buffer[2], buffer[3]]);
      let arrayModel = new Uint8Array([
        buffer[4],
        buffer[5],
        buffer[6],
        buffer[7],
        buffer[8],
        buffer[9],
        buffer[10],
        buffer[11],
        buffer[12],
        buffer[13],
        buffer[14],
        buffer[15],
        buffer[16],
        buffer[17],
        buffer[18],
        buffer[19],
        buffer[20],
      ]);
      let arrayType = new Uint8Array([
        buffer[21],
        buffer[22],
        buffer[23],
        buffer[24],
        buffer[25],
        buffer[26],
        buffer[27],
        buffer[28],
        buffer[29],
      ]);
      decoded.fwVersion = String.fromCharCode.apply(null, arrayVersion);
      decoded.model = String.fromCharCode.apply(null, arrayModel);
      decoded.type = String.fromCharCode.apply(null, arrayType);
      decoded.mac =
        buffer[30].toString(16).toUpperCase().padStart(2, '0') + ":" +
        buffer[31].toString(16).toUpperCase().padStart(2, '0') + ":" +
        buffer[32].toString(16).toUpperCase().padStart(2, '0') + ":" +
        buffer[33].toString(16).toUpperCase().padStart(2, '0') + ":" +
        buffer[34].toString(16).toUpperCase().padStart(2, '0') + ":" +
        buffer[35].toString(16).toUpperCase().padStart(2, '0');
      decoded.modbusAddress = buffer[36];
      decoded.modbusParity = buffer[37];
      decoded.modbusBaudRate = (buffer[38] << 24) | (buffer[39] << 16) | (buffer[40] << 8) | buffer[41];
      break;
    default:
      consol.log("No possible decode");
  }
  return decoded;
}
