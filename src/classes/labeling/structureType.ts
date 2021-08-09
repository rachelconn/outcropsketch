import paper, { PaperScope } from 'paper';

/**
 * Possible structure types - values are meant for serialization, not pretty output
 */
export enum StructureType {
  STRUCTURELESS = 'structureless',
  PLANAR_BEDDED = 'planar bedded',
  CROSS_BEDDED = 'cross bedded',
  GRADED = 'graded',
  CONTORTED = 'contorted',
  UNKNOWN = 'unknown',
  COVERED = 'covered',
}

const structureTypeNames = new Map<StructureType, string>([
  [StructureType.STRUCTURELESS, 'Massive/structureless'],
  [StructureType.PLANAR_BEDDED, 'Planar bedded/laminated'],
  [StructureType.CROSS_BEDDED, 'Cross bedded/laminated'],
  [StructureType.GRADED, 'Graded bed'],
  [StructureType.CONTORTED, 'Contorted/soft sediment deformation'],
  [StructureType.UNKNOWN, 'Unknown area of interest'],
  [StructureType.COVERED, 'Covered'],
]);

const structureTypeColors = new Map<StructureType, paper.Color>([
  [StructureType.STRUCTURELESS, new paper.Color('#a51c1c')],
  [StructureType.PLANAR_BEDDED, new paper.Color('#c27c21')],
  [StructureType.CROSS_BEDDED, new paper.Color('#c0bd27')],
  [StructureType.GRADED, new paper.Color('#26c221')],
  [StructureType.CONTORTED, new paper.Color('#2521c2')],
  [StructureType.UNKNOWN, new paper.Color('#9c21c2')],
  [StructureType.COVERED, new paper.Color('black')],
]);

/**
 * Gives a pretty-formatted representation of a StructureType
 * @param structureType StructureType to get a human-readable name for
 */
export function getStructureTypeName(structureType: StructureType): string {
  const name = structureTypeNames.get(structureType);
  if (name === undefined) throw Error(`No name for StructureType ${structureType}`);
  return name;
}

export function getStructureTypeColor(structureType: StructureType): paper.Color {
  const color = new paper.Color(structureTypeColors.get(structureType));
  if (color === undefined) throw Error(`No color for StructureType ${structureType}`);
  return color;
}
