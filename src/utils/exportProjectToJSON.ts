import paper from 'paper-jsdom-canvas';
import SerializedProject, { Version } from '../classes/serialization/project';
import downloadString from './downloadString';
import Layer, { NonLabelType } from '../classes/layers/layers';
import { paperLayers } from './paperLayers';
import { ExportedProject } from '../classes/paperjs/types';
import removeExtension from './filenameManipulation';
import store from '../redux/store';

/* Current version of export format ([major, minor, patch]): if any breaking changes are made this must be incremented,
 * but this should be avoided unless completely necessary.
 * History:
 *     1.0.0: Changed data.label to data.labelText and made data.label correspond to a LabelValue.
 *     1.1.0: Remove the ability to create CompoundPaths. Note that this breaks compatibility as designs going forward
 *            will be made under the assumption that no CompoundPaths exist, and it removes edge case handling for them.
 *     2.0.0: Store image name as project metadata
 *            Add "unsure" label
 *            Keep track of label locations to allow displaying where unlabeled areas are (breaks compatibility)
 *     2.1.0: Add labelTypes to export format
 */
export const CURRENT_VERSION: Version = [2, 1, 0];

export function versionLoadable(version: Version | undefined): boolean {
  if (!version) return false;
  return (
    version.every((ver, i) => ver === CURRENT_VERSION[i]) // If versions match
    || (version[0] === 2 && CURRENT_VERSION[0] === 2) // If both versions are 2.x.x (as they're designed to be compatible)
  );
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

  const state = store.getState();
  const serializedProject: SerializedProject = {
    image: state.image.URI,
    imageName: state.image.name,
    project: JSON.stringify(project),
    version: CURRENT_VERSION,
    labels: state.labels.labels,
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
  const filename = `${removeExtension(store.getState().image.name)}.json`;
  downloadString(serializeProject(), filename);
};
