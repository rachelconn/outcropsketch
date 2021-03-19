import paper from 'paper';
import { PackageType } from './packageType';
import { StructureType } from './structureType';
import { SurfaceType } from './surfaceType';

/**
 * Types of data that can be labeled: these correspond to each hierarchical classification level
 */
export enum LabelType {
  STRUCTURE = 'structure',
  PACKAGE = 'package',
  SURFACE = 'surface',
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
