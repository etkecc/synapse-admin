/**
 * Decode a URI component, and if it fails, return the original string.
 * @param str The string to decode.
 * @returns The decoded string, or the original string if decoding fails.
 * @example decodeURIComponent("Hello%20World") // "Hello World"
 */
const decodeURLComponent = (str: any): any => {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
};

export default decodeURLComponent;
