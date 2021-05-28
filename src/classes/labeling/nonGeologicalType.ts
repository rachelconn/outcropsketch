import paper from 'paper';

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
}

const nonGeologicalTypeNames = new Map<NonGeologicalType, string>([
  [NonGeologicalType.PERSON, 'Person'],
  [NonGeologicalType.COMPASS, 'Compass'],
  [NonGeologicalType.HAMMER, 'Hammer/pickaxe'],
  [NonGeologicalType.PENCIL, 'Pencil/pen'],
  [NonGeologicalType.SKY, 'Sky/horizon'],
  [NonGeologicalType.FOLIAGE, 'Foliage/vegetation'],
  [NonGeologicalType.MISC, 'Miscellaneous/unidentified'],
]);

const nonGeologicalTypeColors = new Map<NonGeologicalType, paper.Color>([
  [NonGeologicalType.PERSON, new paper.Color('#ff6663')],
  [NonGeologicalType.COMPASS, new paper.Color('#feb144')],
  [NonGeologicalType.HAMMER, new paper.Color('#fdfd97')],
  [NonGeologicalType.PENCIL, new paper.Color('#9ee09e')],
  [NonGeologicalType.SKY, new paper.Color('#93c1cf')],
  [NonGeologicalType.FOLIAGE, new paper.Color('#cc99c9')],
  [NonGeologicalType.MISC, new paper.Color('#949494')],
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

export function getNonGeologicalTypeColor(nonGeologicalType: NonGeologicalType): paper.Color {
  const color = nonGeologicalTypeColors.get(nonGeologicalType);
  if (color === undefined) throw Error(`No color for NonGeologicalType ${nonGeologicalType}`);
  return color;
}
