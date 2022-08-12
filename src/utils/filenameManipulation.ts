/**
 * Removes the extension (.jpg, .json, ...) from a string
 * @param filename Raw name of file
 * @returns filename with the extension removed
 */
export default function removeExtension(filename: string): string {
  return filename.substring(0, filename.lastIndexOf('.'));
}

export function getExtension (filename: string): string {
  return filename.substring(filename.lastIndexOf('.') + 1);
}
