import paper from 'paper';
import SerializedProject from '../classes/serialization/project';
import downloadString from './downloadString';
import store from '..';
import Layer from '../classes/layers/layers';
import { paperLayers } from './paperLayers';

/**
 * Exports the project (including all labels, other layers, and the image) as JSON.
 */
export default function exportProjectToJSON() {
  // Temporarily make all layers fully opaque for export
  const opacities = new Map<Layer, number>();
  paperLayers.forEach((layer) => {
    opacities.set(layer, paper.project.layers[layer].opacity);
  });

  const project: SerializedProject = {
    image: store.getState().image.URI,
    project: paper.project.exportJSON(),
  };

  // Restore opacities
  opacities.forEach((opacity, layer) => {
    paper.project.layers[layer].opacity = opacity;
  });

  downloadString(JSON.stringify(project), 'labeled.json');
};
