import paper from 'paper';
import { PackageType } from './packageType';
import { StructureType } from './structureType';
import { SurfaceType } from './surfaceType';
import { NonGeologicalType } from './nonGeologicalType';

/**
 * Types of data that can be labeled: these correspond to each hierarchical classification level
 */
export enum LabelType {
  STRUCTURE = 'structure',
  PACKAGE = 'package',
  SURFACE = 'surface',
  NONGEOLOGICAL = 'nongeological',
}

export interface StructureTypeTool {
  tool: paper.Tool,
  structureType: StructureType,
}

export interface PackageTypeTool {
  tool: paper.Tool,
  packageType: PackageType,
}

export interface SurfaceTypeTool {
  tool: paper.Tool,
  surfaceType: SurfaceType,
}

export interface NonGeologicalTypeTool {
  tool: paper.Tool
  nonGeologicalType: NonGeologicalType,
}

const labelTypeNames = new Map<LabelType, string>([
  [LabelType.STRUCTURE, 'Structure Type'],
  [LabelType.SURFACE, 'Surface Type'],
  [LabelType.PACKAGE, 'Package Type'],
  [LabelType.NONGEOLOGICAL, 'Non-Geological Type'],
]);

export function getLabelTypeName(labelType: LabelType): string {
  const name = labelTypeNames.get(labelType);
  if (name) return name;
  throw new Error(`No name for LabelType ${labelType}`);
}
