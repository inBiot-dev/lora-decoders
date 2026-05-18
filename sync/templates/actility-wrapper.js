function decodeUplink(input) {
  var result = {
    data: {},
    errors: [],
    warnings: []
  };
  try {
    result.data = InbiotDeviceDecodeUplink(input.bytes);
  } catch (e) {
    result.errors.push(e.message);
  }
  return result;
}

function encodeDownlink(input) {
  var result = {
    bytes: [],
    fPort: 1,
    errors: [],
    warnings: []
  };
  try {
    result.bytes = InbiotDeviceDecodeDownlink(input);
  } catch (e) {
    result.errors.push(e.message);
  }
  return result;
}

function decodeDownlink(input) {
  var result = {
    data: {},
    errors: [],
    warnings: []
  };
  try {
    result.data.bytes = input.bytes;
  } catch (e) {
    result.errors.push(e.message);
  }
  return result;
}

