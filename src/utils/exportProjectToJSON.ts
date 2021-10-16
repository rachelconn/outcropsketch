import paper from 'paper';
import SerializedProject, { Version } from '../classes/serialization/project';
import downloadString from './downloadString';
import store from '..';
import Layer, { NonLabelType } from '../classes/layers/layers';
import { paperLayers } from './paperLayers';
import { ExportedProject } from '../classes/paperjs/types';

/* Current version of export format ([major, minor, patch]): if any breaking changes are made this must be incremented,
 * but this should be avoided unless completely necessary.
 * History:
 *     1.0.0: Changed data.label to data.labelText and made data.label correspond to a LabelValue.
 *     2.0.0: Remove the ability to create CompoundPaths. Note that this breaks compatibility as designs going forward
 *            will be made under the assumption that no CompoundPaths exist, and it removes edge case handling for them.
 */
export const CURRENT_VERSION: Version = [2, 0, 0];

export function versionLoadable(version: Version | undefined): boolean {
  if (!version) return false;
  return version.every((ver, i) => ver === CURRENT_VERSION[i]);
}

/**
 * Serializes the paper project to a string for loading later
 * @returns The project serialized as a JSON string
 */
export function serializeProject(): string {
  // Temporarily make all layers fully opaque for export
  const opacities = new Map<Layer, number>();
  paperLayers.forEach((layer) => {
    opacities.set(layer, paper.project.layers[layer].opacity);
  });

  const project = paper.project.exportJSON({ asString: false }) as unknown as ExportedProject;
  for (let i = 0; i < project.length; i++) {
    const [itemType, itemData] = project[i];
    if (itemType === 'Layer' && itemData.name === NonLabelType.TOOL) {
      project.splice(i, 1);
      break;
    }
  }

  const serializedProject: SerializedProject = {
    image: store.getState().image.URI,
    project: JSON.stringify(project),
    version: CURRENT_VERSION,
  };

  // Restore opacities
  opacities.forEach((opacity, layer) => {
    paper.project.layers[layer].opacity = opacity;
  });

  return JSON.stringify(serializedProject);
}

/**
 * Exports the project (including all labels, other layers, and the image) as JSON.
 */
export default function exportProjectToJSON() {

  downloadString(serializeProject(), 'labeled.json');
};
