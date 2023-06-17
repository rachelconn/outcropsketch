/**
 * Possible non-geological types - values are meant for serialization, not pretty output
 */
export enum NonGeologicalType {
  PERSON = 'person',
  COMPASS = 'compass',
  HAMMER = 'hammer',
  PENCIL = 'pencil',
  SKY = 'sky',
  FOLIAGE = 'foliage',
  MISC = 'misc',
  UNSURE = 'unsure',
}

const nonGeologicalTypeNames = new Map<NonGeologicalType, string>([
  [NonGeologicalType.PERSON, 'Person'],
  [NonGeologicalType.COMPASS, 'Compass'],
  [NonGeologicalType.HAMMER, 'Hammer/pickaxe'],
  [NonGeologicalType.PENCIL, 'Pencil/pen'],
  [NonGeologicalType.SKY, 'Sky/horizon'],
  [NonGeologicalType.FOLIAGE, 'Foliage/vegetation'],
  [NonGeologicalType.MISC, 'Miscellaneous/unidentified'],
  [NonGeologicalType.UNSURE, 'Unsure'],
]);

const nonGeologicalTypeColors = new Map<NonGeologicalType, string>([
  [NonGeologicalType.PERSON, '#ff6663'],
  [NonGeologicalType.COMPASS, '#feb144'],
  [NonGeologicalType.HAMMER, '#fdfd97'],
  [NonGeologicalType.PENCIL, '#9ee09e'],
  [NonGeologicalType.SKY, '#93c1cf'],
  [NonGeologicalType.FOLIAGE, '#cc99c9'],
  [NonGeologicalType.MISC, '#949494'],
  [NonGeologicalType.UNSURE, '#ff0000'],
]);

/**
 * Gives a pretty-formatted representation of a SurfaceType
 * @param surfaceType SurfaceType to get a human-readable name for
 */

export function getNonGeologicalTypeName(nonGeologicalType: NonGeologicalType): string {
  const name = nonGeologicalTypeNames.get(nonGeologicalType);
  if (name === undefined) throw Error(`No name for NonGeologicalType ${nonGeologicalType}`);
  return name;
}

export function getNonGeologicalTypeColor(nonGeologicalType: NonGeologicalType): string {
  const color = nonGeologicalTypeColors.get(nonGeologicalType);
  if (color === undefined) throw Error(`No color for NonGeologicalType ${nonGeologicalType}`);
  return color;
}
