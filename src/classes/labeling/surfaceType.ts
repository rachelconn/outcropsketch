import paper from 'paper';

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

const surfaceTypeColors = new Map<SurfaceType, paper.Color>([
  [SurfaceType.EROSION, new paper.Color('#a51c1c')],
  [SurfaceType.FRACTURE, new paper.Color('#c27c21')],
  [SurfaceType.FAULT, new paper.Color('#c0bd27')],
  [SurfaceType.PALEOSOL, new paper.Color('#26c221')],
  [SurfaceType.LAG, new paper.Color('#21c2ad')],
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
