export enum PackageType {
  CHANNEL = 'channel',
  FLOODPLAIN = 'floodplain',
}

const packageTypeNames = new Map<PackageType, string>([
  [PackageType.CHANNEL, 'Channel deposit'],
  [PackageType.FLOODPLAIN, 'Floodplain deposit'],
]);

/**
 * Gives a pretty-formatted representation of a PackageType
 * @param packageType PackageType to get a human-readable name for
 */
export function getPackageTypeName(packageType: PackageType): string {
  const name = packageTypeNames.get(packageType);
  if (name === undefined) throw Error(`Undefined PackageType ${packageType}`);
  return name;
}
