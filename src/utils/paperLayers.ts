import paper from 'paper';
import store from '..';
import { LabelType } from '../classes/labeling/labeling';
import Layer, { NonLabelType } from '../classes/layers/layers'
import { ToolOption } from '../classes/toolOptions/toolOptions';

export const paperLayers: Layer[] = [];
export const labelLayers: LabelType[] = [];
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

/**
 * Creates all missing paper layers, should be used when initializing the project or loading a label file
 */
export function initializePaperLayers() {
  paperLayers.forEach((layer) => {
    // Check if layers exist before creating them
    if (!paper.project.layers[layer]) new paper.Layer({ name: layer })
  });
}

export function clearAllLayers() {
  paperLayers.forEach((layer) => paper.project.layers[layer].removeChildren());
}

/**
 * Scales a number with the current zoom level
 * @param x Number to scale
 */
export function scaleToZoom(x: number) {
  return x / store.getState().image.scale;
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

  // Process other label types first, then ones of the same type.
  // This is so interactions with other labels and the same one are handled in a deterministic way,
  // which is useful for ensuring that different combinations of tool options are always handled the same way.
  const sameLabel: paper.PathItem[] = [];
  const differentLabel: paper.PathItem[] = [];
  paper.project.layers[layer].children.forEach((item: paper.PathItem) => {
    if (item === insertedItem) return;
    if (item.data.label === insertedItem.data.label) sameLabel.push(item);
    else differentLabel.push(item);
  });

  [...differentLabel, ...sameLabel].forEach((item: paper.PathItem) => {
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

export interface SnapToNearbyOptions {
  // Setting value to use as the snapping threshold
  toleranceOption: ToolOption,
  // Item to exclude from
  exclude?: paper.PathItem,
  // Whether to only snap to the same label: if set this will override the snap same label tool option
  sameLabelOnly?: boolean,
  // If set snapping will only go to the ends of open paths rather than snap to any point
  endsOnly?: boolean,
}

export interface SnapToNearbyReturnValue {
  point: paper.Point,
  path?: paper.PathItem,
}

/**
 * Snaps point to the closest previously-placed point (if the option is set)
 * @param point The point to move
 * @param exclude (optional) an item to exclude from snapping
 */
export function snapToNearby(point: paper.Point, options: SnapToNearbyOptions): SnapToNearbyReturnValue {
  const state = store.getState();
  const { scale } = state.image;
  const tolerance = state.options.toolOptionValues[options.toleranceOption] / scale;
  const snapSameLabel = options.sameLabelOnly || state.options.toolOptionValues[ToolOption.SNAP_SAME_LABEL];
  // If snapping is disabled, use point as-is
  if (tolerance === 0) return { point };

  // Snapping enabled, find closest point within tolerance
  const hitTestOptions = options.endsOnly ? {
    tolerance,
    ends: true,
  } : {
    tolerance,
    class: paper.PathItem,
    stroke: true,
  };

  // Snap to closest labeled point if option set
  let closestDistance = Infinity;
  let closestPoint = point;
  let closestPath: paper.PathItem;

  labelLayers.forEach((layerName) => {
    // Don't snap to layers that are transparent
    const layer = paper.project.layers[layerName];
    if (layer.opacity === 0) return;

    layer.hitTestAll(point, hitTestOptions).forEach(({ item, point: hitPoint }) => {
      // Exclude same label, snap to only that label, or snap to anything depending on options
      if (item.data.label === options.exclude?.data.label) {
        if (!snapSameLabel) return;
      }
      else if (options.sameLabelOnly) return;

      if (item instanceof paper.PathItem) {
        const closest = item.getNearestLocation(point);

        let itemClosestPoint: paper.Point;
        // If snapping to ends only, use hit point as-is
        if (options.endsOnly) itemClosestPoint = hitPoint;
        // Otherwise refer snapping to segments, not arbitrary points on the path (prevents messy edges)
        else itemClosestPoint = point.getDistance(closest.segment.point) <= tolerance ? closest.segment.point : closest.point;

        // Update closest point
        const distance = point.getDistance(itemClosestPoint);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPoint = itemClosestPoint;
          closestPath = item;
        }
      }
    });
  });

  point = closestPoint;
  return {
    point: closestPoint,
    path: closestPath,
  };
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
  labelLayers.forEach((layerName) => {
    // Don't erase if layer is fully transparent
    const layer = paper.project.layers[layerName];
    if (layer.opacity === 0) return;

    [...layer.children].forEach((item: paper.PathItem) => {
      // Skip unnecessary items
      if (item === path || !path.bounds.intersects(item.bounds)) return;

      // Skip unclosed paths (such as surfaces)
      // TODO: could probably improve this by removing segments in the drawn area instead
      if (item instanceof paper.Path && !item.closed) return;

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
  labelLayers.forEach((layerName) => {
    // Don't slice if layer is fully transparent
    const layer = paper.project.layers[layerName];
    if (layer.opacity === 0) return;

    [...layer.children].forEach((item: paper.Path | paper.CompoundPath) => {
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

/**
* Returns the label item at the provided point, or undefined if there are none.
 * @param point Point to check
 * @returns The Path corresponding to the detected label (or undefined if there is none)
 */
export function findLabelAtPoint(point: paper.Point): paper.Path {
    let detectedItem: paper.Path;
    labelLayers.forEach((layerName) => {
      const layer: paper.Layer = paper.project.layers[layerName];
      if (layer.opacity === 0) return;

      // Hit test layer and make sure something was hit
      const hit = layer.hitTest(point);
      if (!hit) return;
      const { item, type } = hit;
      if (type === 'fill' && item.fillColor === undefined) return;

      // Update hoveredItem
      if (item instanceof paper.Path) detectedItem = item;
      else if (item instanceof paper.CompoundPath) {
        item.children.forEach((child) => {
          if (detectedItem) return;
          if (child.hitTest(point)) detectedItem = child as paper.Path;
        });
      }
    });

    return detectedItem;
}
