/**
 * Possible surface types - values are meant for serialization, not pretty output
 */
export enum SurfaceType {
  EROSION = 'erosion',
  FRACTURE = 'fracture',
  FAULT = 'fault',
  PALEOSOL = 'paleosol',
}

const surfaceTypeNames = new Map<SurfaceType, string>([
  [SurfaceType.EROSION, 'Erosion/scour surface'],
  [SurfaceType.FRACTURE, 'Fracture'],
  [SurfaceType.FAULT, 'Fault'],
  [SurfaceType.PALEOSOL, 'Paleosol'],
]);

const surfaceTypeColors = new Map<SurfaceType, string>([
  [SurfaceType.EROSION, '#2f0a3a'],
  [SurfaceType.FRACTURE, '#885717'],
  [SurfaceType.FAULT, '#0f4e0d'],
  [SurfaceType.PALEOSOL, '#cc5500'],
]);

/**
 * Gives a pretty-formatted representation of a SurfaceType
 * @param surfaceType SurfaceType to get a human-readable name for
 */
export function getSurfaceTypeName(surfaceType: SurfaceType): string {
  const name = surfaceTypeNames.get(surfaceType);
  if (name === undefined) throw Error(`Undefined SurfaceType ${surfaceType}`);
  return name;
}

export function getSurfaceTypeColor(surfaceType: SurfaceType): string {
  const color = surfaceTypeColors.get(surfaceType);
  if (color === undefined) throw Error(`No color for SurfaceType ${surfaceType}`);
  return color;
}
