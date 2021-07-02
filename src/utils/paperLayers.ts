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

/**
 * Handles overlapping paths for a given layer, optionally overwriting paths of different types
 * @param insertedItem The item that was inserted
 * @param layer Layer to check and remove overlaps from
 * @param overwrite Whether to overwrite overlapping labels of different types with the inserted item
 * @returns The inserted item after handling overlaps
 */
export function handleOverlap(insertedItem: paper.PathItem, layer: Layer, overwrite: boolean): paper.PathItem {
  paper.project.layers[layer].children.forEach((item: paper.PathItem) => {
    // Do nothing for the path being drawn and non-intersecting items
    if (item === insertedItem || !item.bounds.intersects(insertedItem.bounds)) return;

    // Merge with paths for the same label
    if (insertedItem.data.labelText === item.data.labelText) {
      const merged = item.unite(insertedItem);
      item.replaceWith(merged);
      merged.data = { ...insertedItem.data };
      insertedItem.remove();
      insertedItem = merged;
    }

    // Overwrite previous other labels if option is set, otherwise draw under them
		else {
			let diff;
			if (overwrite) {
				diff = item.subtract(insertedItem);
				item.replaceWith(diff);
				diff.data = { ...item.data };
			}
			else {
				diff = insertedItem.subtract(item);
				insertedItem.replaceWith(diff);
				insertedItem = diff;
				diff.data = { ...insertedItem.data };
			}

			if (diff instanceof paper.CompoundPath) {
				// Path was split into multiple parts, give each child the correct data
				diff.children.forEach((child) => child.data = { ...diff.data });
			}
		}
	});

  return insertedItem;
}
