/**
 * Extracts named functions from JavaScript source text using brace-depth counting.
 * No external dependencies — only Node.js built-ins.
 */

/**
 * Extracts the full text of a named function declaration.
 * Handles: function name(...) { ... }
 */
function extractFunction(source, functionName) {
  const marker = "function " + functionName + "(";
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error("Function not found in source: " + functionName);
  }
  let depth = 0;
  let i = start;
  let foundOpen = false;
  while (i < source.length) {
    if (source[i] === "{") {
      depth++;
      foundOpen = true;
    } else if (source[i] === "}") {
      depth--;
      if (foundOpen && depth === 0) {
        return source.slice(start, i + 1);
      }
    }
    i++;
  }
  throw new Error("Unclosed function: " + functionName);
}

/**
 * Returns everything from after the named function's closing brace to end of file.
 * Used to extract all helper functions that follow the main decode function.
 */
function extractAfterFunction(source, functionName) {
  const marker = "function " + functionName + "(";
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error("Function not found in source: " + functionName);
  }
  let depth = 0;
  let i = start;
  let foundOpen = false;
  while (i < source.length) {
    if (source[i] === "{") {
      depth++;
      foundOpen = true;
    } else if (source[i] === "}") {
      depth--;
      if (foundOpen && depth === 0) {
        return source.slice(i + 1).trimStart();
      }
    }
    i++;
  }
  throw new Error("Unclosed function: " + functionName);
}

module.exports = { extractFunction, extractAfterFunction };
