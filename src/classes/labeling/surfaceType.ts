/**
 * Possible surface types - values are meant for serialization, not pretty output
 */
export enum SurfaceType {
  EROSION = 'erosion',
  FRACTURE = 'fracture',
  FAULT = 'fault',
  PALEOSOL = 'paleosol',
  LAG = 'lag',
}

const surfaceTypeNames = new Map<SurfaceType, string>([
  [SurfaceType.EROSION, 'Erosion/scour surface'],
  [SurfaceType.FRACTURE, 'Fracture'],
  [SurfaceType.FAULT, 'Fault'],
  [SurfaceType.PALEOSOL, 'Paleosol'],
  [SurfaceType.LAG, 'Lag/ravinement'],
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
