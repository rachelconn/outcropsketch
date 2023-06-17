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
  [StructureType.CONTORTED, 'Contorted/Soft sediment deformation'],
  [StructureType.UNKNOWN, 'Unsure of structure type'],
  [StructureType.COVERED, 'Covered'],
]);

const structureTypeColors = new Map<StructureType, string>([
  [StructureType.STRUCTURELESS, '#a51c1c'],
  [StructureType.PLANAR_BEDDED, '#c27c21'],
  [StructureType.CROSS_BEDDED, '#c0bd27'],
  [StructureType.GRADED, '#26c221'],
  [StructureType.CONTORTED, '#2521c2'],
  [StructureType.UNKNOWN, '#9c21c2'],
  [StructureType.COVERED, 'black'],
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

export function getStructureTypeColor(structureType: StructureType): string {
  const color = structureTypeColors.get(structureType);
  if (color === undefined) throw Error(`No color for StructureType ${structureType}`);
  return color;
}
