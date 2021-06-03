export default function formatKeyName(key: string): string {
  if (key === ' ') return 'Space'
  return key.charAt(0).toUpperCase() + key.slice(1);
}
