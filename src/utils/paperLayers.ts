import paper from 'paper';
import { LabelType } from '../classes/labeling/labeling';
import Layer, { NonLabelType } from '../classes/layers/layers'

const paperLayers: Layer[] = [];
Object.values(LabelType).forEach((labelType) => paperLayers.push(labelType));
Object.values(NonLabelType).forEach((NonLabelType) => paperLayers.push(NonLabelType));

// Make sure there are no duplicate layers
console.assert(
  new Set(paperLayers).size === paperLayers.length,
  `WARNING: Not all Layer values are unique, this could lead to problems when you expect tools to use different layers.
  Layers: ${paperLayers}`
);

export default paperLayers;

export function clearAllLayers() {
  paperLayers.forEach((layer) => paper.project.layers[layer].removeChildren());
}
