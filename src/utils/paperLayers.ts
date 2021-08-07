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
 * Parses a drawn path object into a closed shape, and removes the original path.
 * If the shape has no segments, returns undefined.
 * @param path Path to convert into a closed shape.
 */
export function convertToShape(path: paper.Path): paper.PathItem {
    // Close path, then convert to shape
    path.closePath();
    let pathAsShape = path.unite(undefined);
    path.replaceWith(pathAsShape);

    // If path has no segments, remove it and return undefined
    if (pathAsShape instanceof paper.Path && pathAsShape.segments.length === 0) {
      pathAsShape.remove();
      return;
    }

    // Copy data from original path
    pathAsShape.data = { ...path.data };
    if (pathAsShape instanceof paper.CompoundPath) {
      pathAsShape.children.forEach((child) => { child.data = {...pathAsShape.data }; });
    }

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
    const items = [...paper.project.layers[layer].children];
    items.forEach((item: paper.PathItem) => {
      // Skip unnecessary items
      if (item === path || !path.bounds.intersects(item.bounds)) return;

      // Subtract from overlapping area and copy data, deleting if no segments remain
      let newItem = item.subtract(path);
      item.replaceWith(newItem);
      newItem.data = { ...item.data };
      if (newItem instanceof paper.CompoundPath) {
        newItem.children.forEach((child) => {
          if (child instanceof paper.Path && child.segments.length === 0) child.remove();
          else child.data = { ...item.data };
        });
      }
      else if (newItem instanceof paper.Path && newItem.segments.length === 0) newItem.remove();

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

/**
 * Slices all label paths based on a drawn path
 * @param path Path to slice all labels on
 * @returns Whether or not any objects were sliced
 */
export function sliceOnPath(path: paper.Path): boolean {
  function sliceItem(item: paper.Path, pathToCheck = path) {
    // TODO: set data correctly
    // Determine intersections: sort by offset from start of path for deterministic behavior when calling splitAt()
    const pathClone = pathToCheck.clone({ insert: false });
    const intersections = pathClone.getIntersections(item).sort((a, b) => a.offset - b.offset);

    // Ignore pairs of intersections with lines outside the item being sliced
    while (intersections.length >= 2) {
      const midpoint = (intersections[0].offset + intersections[1].offset) / 2;
      if (item.hitTest(pathToCheck.getPointAt(midpoint))) break;
      intersections.shift();
    }

    // Process the first pair of intersections
    const firstIntersection = pathClone.getLocationOf(intersections[0]?.point);
    const secondIntersection = pathClone.getLocationOf(intersections[1]?.point);
    // If there are less than two intersections, there's nothing to slice on
    if (!secondIntersection) return false;

    // Use the part of the path between the first and second intersections
    const pathToUse = pathClone.splitAt(firstIntersection);

    // Use the rest of the path to process further intersections later
    const remainingPath = pathToUse.splitAt(secondIntersection);

    // Split item at the correct locations and join it with the proper part of the path
    const firstHalf = item.splitAt(item.getLocationOf(firstIntersection.point));
    const secondHalf = item.splitAt(item.getLocationOf(secondIntersection.point));
    firstHalf.join(pathToUse, 0.01);
    secondHalf.join(pathToUse, 0.01);

    // If there are two more intersections, slice recursively using the rest of pathToUse
    if (intersections.length >= 4) {
      sliceItem(firstHalf, remainingPath);
      sliceItem(secondHalf, remainingPath);
    }

    return true;
  }

  // Remember whether any objects were sliced
  let sliced = false;

  // Divide items that were sliced
  labelLayers.forEach((layer) => {
    const items = [...paper.project.layers[layer].children];
    items.forEach((item: paper.Path | paper.CompoundPath) => {
      // Ignore path to split on
      if (item === path) return;

      // Slicing holes inside of CompoundPaths results in unwanted behavior
      // and paper js cannot currently handle this properly as far as I can tell.
      // See https://github.com/paperjs/paper.js/issues/1215 for the proposed solution (which doesn't work for this purpose)
      if (item instanceof paper.CompoundPath) {
        // Note: clockwise detects whether a child is a part of the path or a hole properly,
        // but I'm not sure there exists a way to properly slice the shapes since the boundaries
        // don't align with the intersections
        // item.reorient(true, true);
        // item.children.forEach((child: paper.Path) => {
        //   if (child.clockwise) {
        //     sliceItem(child);
        //   }
        // });
      }

      // Split normal Path items normally: note the order of terms here to avoid short-circuit evaluation
      else sliced = sliceItem(item) || sliced;
    });
  });

  return sliced;
}
