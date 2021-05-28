import paper from 'paper';

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

const surfaceTypeColors = new Map<SurfaceType, paper.Color>([
  [SurfaceType.EROSION, new paper.Color('#2f0a3a')],
  [SurfaceType.FRACTURE, new paper.Color('#885717')],
  [SurfaceType.FAULT, new paper.Color('#0f4e0d')],
  [SurfaceType.PALEOSOL, new paper.Color('#cc5500')],
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

export function getSurfaceTypeColor(surfaceType: SurfaceType): paper.Color {
  const color = surfaceTypeColors.get(surfaceType);
  if (color === undefined) throw Error(`No color for SurfaceType ${surfaceType}`);
  return color;
}
