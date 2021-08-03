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
  // Remember the inserted item for intersection checks: don't want to use the new
  // bounding box when merging to avoid unintended merges
  const originalItem = insertedItem;

  const toolOptions = store.getState().options.toolOptionValues;
  const overwrite = toolOptions[ToolOption.OVERWRITE];
  const mergeSameLabel = toolOptions[ToolOption.MERGE_SAME_LABEL];

  const items = [...paper.project.layers[layer].children];
  items.forEach((item: paper.PathItem) => {
    // Do nothing for the path being drawn and non-intersecting items
    if (item === insertedItem) return;
    // Note: path.intersects(path) only checks for stroke intersection, NOT fill so this must be checked separately
    if (!item.bounds.contains(originalItem.bounds) && !originalItem.bounds.contains(item.bounds) && !item.intersects(originalItem)) return;

    // Merge with paths for the same label if option is set
    if (insertedItem.data.label === item.data.label) {
      if (!mergeSameLabel) return;

      const merged = item.unite(insertedItem);
      merged.data = { ...insertedItem.data };
      if (merged instanceof paper.CompoundPath) {
        merged.children.forEach((child) => { child.data = {...merged.data }; });
      }
      insertedItem.replaceWith(merged);
      item.remove();
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
  let closestPoint = point;

  labelLayers.forEach((layer) => {
    paper.project.layers[layer].hitTestAll(point, hitTestOptions).forEach(({ item }) => {
      // Don't snap to same label unless option is set
      if (!snapSameLabel && item.data.label === exclude.data.label) return;

      if (item instanceof paper.PathItem) {
        const closest = item.getNearestLocation(point);

        // Prefer snapping to segments, not arbitrary points on the path (prevents messy edges)
        const itemClosestPoint = point.getDistance(closest.segment.point) <= tolerance ? closest.segment.point : closest.point;

        // Update closest point
        const distance = point.getDistance(itemClosestPoint);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPoint = itemClosestPoint;
        }
      }
    });
  });

  point = closestPoint;
  return closestPoint;
}

/**
 * Parses a drawn path object into a closed shape, and removes the original path
 * @param path Path to convert into a closed shape.
 */
export function convertToShape(path: paper.Path): paper.PathItem {
    // Close path, then convert to shape
    path.closePath();
    let pathAsShape = path.unite(undefined);

    // Copy data from original path
    pathAsShape.data = { ...path.data };
    if (pathAsShape instanceof paper.CompoundPath) {
      pathAsShape.children.forEach((child) => { child.data = {...pathAsShape.data }; });
    }
    path.replaceWith(pathAsShape);

    return pathAsShape;
}

/**
 * Erases all labels under a provided shape
 * @param path Shape to erase all labels under
 */
export function eraseArea(path: paper.PathItem): boolean {
  let erased = false;

  // Go through each layer and subtract area from all overlapping items
  labelLayers.forEach((layer) => {
    paper.project.layers[layer].children.forEach((item: paper.PathItem) => {
      // Skip unnecessary items
      if (item === path || !path.bounds.intersects(item.bounds)) return;

      // Subtract from overlapping area and copy data
      let newItem = item.subtract(path);
      newItem.data = { ...item.data };
      if (newItem instanceof paper.CompoundPath) newItem.children.forEach((child) => child.data = { ...item.data });
      item.replaceWith(newItem);

      // Determine if anything was actually erased
      erased = erased || !newItem.compare(item);
    });
  });

  return erased;
}

/**
 * Waits for paper js to initialize the project so that it can be successfully read and modified
 * by functions that need it
 * @returns A promise that resolves once paper.project has been initialized
 */
export async function waitForProjectLoad(): Promise<void> {
  const wait = (delay: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };

  return new Promise(async (resolve) => {
    while (!paper.project) {
      await wait(250);
    }

    resolve();
  });
}
