import paper from 'paper';
import SerializedProject from '../classes/serialization/project';
import downloadString from './downloadString';
import store from '..';
import Layer, { NonLabelType } from '../classes/layers/layers';
import { paperLayers } from './paperLayers';



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

  // Export project to JSON and remove tools layer to prevent tool items like labels, markers, and half-complete selections from saving
  // Thank you paper.js for having horrible typing: setting asString: false exports as an array of [itemType, itemData]
  const project = paper.project.exportJSON({ asString: false }) as unknown as [string, { name: string }][];
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
