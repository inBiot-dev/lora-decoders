function consume(event) {
  var { payloadHex } = event.data;
  var bytes = [];
  for (var i = 0; i < payloadHex.length; i += 2) {
    bytes.push(parseInt(payloadHex.substr(i, 2), 16));
  }

  var decoded = InbiotDeviceDecode(bytes);

  // Emit to the corresponding topic based on the packet type (first byte)
  if (bytes[0] === 0) {
    emit("sample", { data: decoded, topic: "configuration" });
  } else if (bytes[0] === 1) {
    emit("sample", { data: decoded, topic: "default" });
  } else if (bytes[0] === 2) {
    emit("sample", { data: decoded, topic: "lifecycle" });
  }
}

