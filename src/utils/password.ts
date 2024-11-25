/**
 * Generate a random user password
 * @returns a new random password as string
 */
export function generateRandomPassword(length = 64): string {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()_-+={[}]|:;'.?/<>,";
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map(x => characters[x % characters.length])
    .join("");
}
