export default function chunk<T>(arr: T[], numChunks: number, chunkIdx: number): T[] {
  if (arr.length < numChunks) return (chunkIdx < arr.length) ? [arr[chunkIdx]] : [];
  const startIdx = arr.length * chunkIdx / numChunks;
  const endIdx = arr.length * (chunkIdx + 1) / numChunks;
  return arr.slice(startIdx, endIdx);
}
