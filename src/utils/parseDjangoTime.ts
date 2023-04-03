export default function parseDjangoTime(t: string): Date {
  return new Date(Date.parse(t));
}
