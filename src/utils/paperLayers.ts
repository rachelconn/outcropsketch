import paper from 'paper';
import store from '..';
import { LabelType } from '../classes/labeling/labeling';
import Layer, { NonLabelType } from '../classes/layers/layers'
import { ToolOption } from '../classes/toolOptions/toolOptions';

const paperLayers: Layer[] = [];
const labelLayers = [];
Object.values(LabelType).forEach((labelType) => {
  paperLayers.push(labelType);
  labelLayers.push(labelType);
});
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
 * @returns The inserted item after handling overlaps
 */
export function handleOverlap(insertedItem: paper.PathItem, layer: Layer): paper.PathItem {
  const toolOptions = store.getState().options.toolOptionValues;
  const overwrite = toolOptions[ToolOption.OVERWRITE];
  const mergeSameLabel = toolOptions[ToolOption.MERGE_SAME_LABEL];

  paper.project.layers[layer].children.forEach((item: paper.PathItem) => {
    // Do nothing for the path being drawn and non-intersecting items
    if (item === insertedItem || !item.bounds.intersects(insertedItem.bounds)) return;

    // Merge with paths for the same label if option is set
    if (insertedItem.data.label === item.data.label) {
      if (!mergeSameLabel) return;

      const merged = item.unite(insertedItem);
      merged.data = { ...insertedItem.data };
      if (merged instanceof paper.CompoundPath) {
        merged.children.forEach((child) => { child.data = {...merged.data }; });
      }
      item.replaceWith(merged);
      insertedItem.remove();
      insertedItem = merged;
    }

    // Overwrite previous other labels if option is set, otherwise draw under them
		else {
			let diff: paper.PathItem;
			if (overwrite) {
				diff = item.subtract(insertedItem);
				diff.data = { ...item.data };
				item.replaceWith(diff);
			}
			else {
				diff = insertedItem.subtract(item);
				diff.data = { ...insertedItem.data };
				insertedItem.replaceWith(diff);
				insertedItem = diff;
			}

			if (diff instanceof paper.CompoundPath) {
				// Path was split into multiple parts, give each child the correct data
				diff.children.forEach((child) => child.data = { ...diff.data });
			}
		}
	});

  return insertedItem;
}

/**
 * Snaps point to the closest previously-placed point (if the option is set)
 * @param point The point to move
 * @param exclude (optional) an item to exclude from snapping
 */
export function snapToNearby(point: paper.Point, exclude: paper.PathItem = undefined) {
  const state = store.getState();
  const { scale } = state.image;
  const tolerance = state.options.toolOptionValues[ToolOption.SNAP] / scale;
  const snapSameLabel = state.options.toolOptionValues[ToolOption.SNAP_SAME_LABEL];
  // If snapping is disabled, use point as-is
  if (tolerance === 0) return point;

  // Snapping enabled, find closest point within tolerance
  const hitTestOptions = {
    tolerance,
    class: paper.PathItem,
    stroke: true,
  };

  // Snap to closest labeled point if option set
  let closestDistance = Infinity;

  labelLayers.forEach((layer) => {
    paper.project.layers[layer].hitTestAll(point, hitTestOptions).forEach(({ item }) => {
      // Don't snap to same label unless option is set
      if (!snapSameLabel && item.data.label === exclude.data.label) return;

      if (item instanceof paper.PathItem) {
        const closest = item.getNearestPoint(point);
        const distance = point.getDistance(closest);
        if (distance < closestDistance) {
          closestDistance = distance;
          point = closest;
        }
      }
    });
  });

  return point;
}
