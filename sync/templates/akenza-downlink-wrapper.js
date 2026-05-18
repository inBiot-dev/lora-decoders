function consume(event) {
  var payload = event.data;
  var encoded = inbiotDeviceDecode(payload);

  // Akenza requires emit('downlink', { payloadHex: '...', port: 1 })
  var hexPayload = "";
  for (var i = 0; i < encoded.length; i++) {
    var hex = encoded[i].toString(16);
    if (hex.length === 1) {
      hex = "0" + hex;
    }
    hexPayload += hex;
  }

  emit("downlink", { payloadHex: hexPayload, port: 1 });
}

