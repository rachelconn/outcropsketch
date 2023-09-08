import paper from 'paper-jsdom-canvas';
import { LabelType } from '../classes/labeling/labeling';
import Layer, { NonLabelType, UNLABELED_AREA_PATH_NAME } from '../classes/layers/layers'
import { ToolOption } from '../classes/toolOptions/toolOptions';
import store from '../redux/store';

export const paperLayers: Layer[] = [];
export const labelLayers: LabelType[] = [];
Object.values(LabelType).forEach((labelType) => {
  // Don't create layer for nongeological as it shares the same layer as structures
  if (labelType === LabelType.NONGEOLOGICAL) return;
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

// Style for unlabeled area
const unlabeledAreaStyle: paper.Style = {
  strokeColor: undefined,
  fillColor: new paper.Color('#ff00ff80'),
} as paper.Style;

/**
 * Creates all missing paper layers, should be used when initializing the project or loading a label file
 */
export function initializePaperLayers(resetUnlabeledArea = true) {
  paperLayers.forEach((layer) => {
    // Check if layers exist before creating them
    if (!paper.project.layers[layer]) new paper.Layer({ name: layer })
  });

  // Set unlabeled area opacity
  paper.project.layers[NonLabelType.UNLABELED_AREA].opacity = store.getState().options.unlabeledAreaOpacity;

  // Reset unlabeled area if option is explicitly given or if the size of the bounds mismatches
  const existingUnlabeledArea = paper.project.layers[NonLabelType.UNLABELED_AREA].children[UNLABELED_AREA_PATH_NAME];
  if (resetUnlabeledArea || !existingUnlabeledArea?.bounds.equals(paper.project.view.bounds)) {
    const unlabeledLayer: paper.Layer = paper.project.layers[NonLabelType.UNLABELED_AREA];
    unlabeledLayer.removeChildren();
    const activeLayer = paper.project.activeLayer;
    unlabeledLayer.activate();
    const unlabeledArea = new paper.Path.Rectangle(paper.project.view.bounds);
    unlabeledArea.name = UNLABELED_AREA_PATH_NAME;
    unlabeledArea.style = unlabeledAreaStyle;

    activeLayer.activate();
  }
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
 * Marks the area under a path as labeled by removing it from the unlabeled area
 * @param path Path to remove from the unlabeled area
 */
export function removeFromUnlabeledArea(path: paper.PathItem) {
  const unlabeledArea = paper.project.layers[NonLabelType.UNLABELED_AREA].children[UNLABELED_AREA_PATH_NAME];
  unlabeledArea.replaceWith(unlabeledArea.subtract(path));
}

/**
 * Marks the area under a path as unlabeled by adding it to the unlabeled area
 * @param path Path to mark as unlabeled
 * @param layer (optional) layer to check instead of the layer the path is on (eg. if it has not been inserted)
 */
export function addToUnlabeledArea(path: paper.PathItem, layer: paper.Layer = undefined) {
  // If the path is unclosed, it has no area and no change needs to be made
  if (path instanceof paper.Path && !path.closed) return;

  const unlabeledArea = paper.project.layers[NonLabelType.UNLABELED_AREA].children[UNLABELED_AREA_PATH_NAME];

  // Determine area that's no longer labeled: need to subtract all other labels that are potentially overlapping
  // so that areas with multiple labels aren't erroneously marked as unlabeled
  let newUnlabeledArea = path.clone({ insert: false });
  paper.project.layers[LabelType.STRUCTURE].children.filter((child: paper.PathItem) => {
    if (child !== path && path.bounds.intersects(child.bounds)) {
      newUnlabeledArea = newUnlabeledArea.subtract(child, { insert: false });
    }
  });

  newUnlabeledArea.style = unlabeledAreaStyle;
  unlabeledArea.replaceWith(unlabeledArea.unite(newUnlabeledArea));
}

/**
 * Flattens a compound path by adding all of its components to the layer it belongs to
 * (if all parts are disjoint). If the path has holes, returns an empty array to signify as such.
 * Note that this does not insert the items by default, nor remove the compound path to improve flexibility.
 * @param path Compound path to flatten
 * @returns An array of the path's components (empty if path has a hole in it)
 */
export function flattenCompoundPath(path: paper.CompoundPath): paper.Path[] {
  const shapes: paper.Path[] = [];

  // CompoundPath is flat if all children have the same winding direction as it
  const isClockwise = path.clockwise;
  let isValid = true;
  path.children.forEach((child: paper.Path) => {
    isValid = isValid && child.clockwise === isClockwise;
  });

  // Flatten if valid
  if (isValid) {
    path.children.forEach((child: paper.Path) => {
      const newChild = child.clone({ insert: false });
      newChild.data = { ...path.data };
      newChild.copyAttributes(path, false);
      shapes.push(newChild);
    });
  }
  return shapes;
}

/**
 * Handles overlapping paths for a given layer, optionally overwriting paths of different types
 * @param insertedItem The item that was inserted
 * @param layer Layer to check and remove overlaps from
 * @returns The inserted item after handling overlaps. If the insertion is invalid, returns undefined.
 */
export function handleOverlap(insertedItem: paper.PathItem, layer: Layer): paper.PathItem {
  // Remember the inserted item for intersection checks: don't want to use the new
  // bounding box when merging to avoid unintended merges
  const originalItem = insertedItem;

  const toolOptions = store.getState().options.toolOptionValues;
  const overwrite = toolOptions[ToolOption.OVERWRITE];
  const merge = toolOptions[ToolOption.MERGE];

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

  let invalid = false;
  [...differentLabel, ...sameLabel].forEach((item: paper.PathItem) => {
    // Do nothing for the path being drawn and non-intersecting items
    if (item === insertedItem || invalid) return;

    // Note: path.intersects(path) only checks for stroke intersection, NOT fill so this must be checked separately
    if (!item.bounds.contains(originalItem.bounds) && !originalItem.bounds.contains(item.bounds) && !item.intersects(originalItem)) return;

    // Ignore existing labels if not merging
    if (!merge) {
      // Draw over existing labels if overwrite is set, otherwise draw under them
      if (overwrite) insertedItem.bringToFront();
      else insertedItem.sendToBack();
    }

    // Merge with paths for the same label if option is set
    else if (insertedItem.data.label === item.data.label) {
      let merged = item.unite(insertedItem);
      // Don't allow compound paths: make into two distinct paths if it is one
      if (merged instanceof paper.CompoundPath) {
        merged.remove();
        merged = insertedItem.subtract(item);
      }
      else {
        item.remove();
      }
      insertedItem.replaceWith(merged);
      insertedItem = merged;
      merged.data = { ...insertedItem.data };
    }

    // Overwrite previous other labels if option is set, otherwise draw under them
		else {
			let diff: paper.PathItem;
			if (overwrite) {
				diff = item.subtract(insertedItem, { insert: false });
        // Don't allow compound paths - simplify them if possible
        if (diff instanceof paper.CompoundPath) {
          const children = flattenCompoundPath(diff);
          if (children.length) {
            children.forEach((child) => {
              if (Math.abs(child.area) > 1) item.layer.addChild(child);
            });
            diff.remove();
            item.remove()
          }
          else {
            // Path cannot be simplified and is invalid
            invalid = true;
          }
        }
        else {
          diff.data = { ...item.data };
          item.replaceWith(diff);
        }
			}
			else {
        // Note that this allows insertedItem to become a compound path: if this isn't desired it must be handled outside of this function
				diff = insertedItem.subtract(item, { insert: false });
        diff.data = { ...insertedItem.data };
        insertedItem.replaceWith(diff);
        insertedItem = diff;
			}
		}
	});

  return invalid ? undefined : insertedItem;
}

export interface SnapToNearbyOptions {
  // Setting value to use as the snapping threshold
  toleranceOption: ToolOption,
  // Item to exclude from
  exclude?: paper.PathItem,
  // A label to prefer snapping to
  preferredLabel?: string;
  // Whether to only snap to the same label: if set this will override the snap same label tool option
  preferSameLabel?: boolean,
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
  const snapSameLabel = options.preferSameLabel || state.options.toolOptionValues[ToolOption.SNAP_SAME_LABEL];
  // If snapping is disabled, use point as-is
  if (tolerance === 0) return { point };

  // Snap to closest labeled point if option set
  let closestDistance = Infinity;
  let closestPoint = point;
  let closestPath: paper.PathItem;
  let closestIsSameLabel = false;

  labelLayers.forEach((layerName) => {
    // Hit test ends on layers with open paths, stroke on ones with closed paths
    const hitTestOptions = options.endsOnly && layerName === LabelType.SURFACE ? {
      tolerance,
      ends: true,
    } : {
      tolerance,
      class: paper.PathItem,
      stroke: true,
    };

    // Don't snap to layers that are transparent
    const layer = paper.project.layers[layerName];
    if (layer.opacity === 0) return;

    layer.hitTestAll(point, hitTestOptions).forEach(({ item, point: hitPoint }) => {
      if (item === options.exclude) return;
      let countAsClosest = false;
      // Exclude same label, snap to only that label, or snap to anything depending on options
      if (item.data.label === options.exclude?.data?.label || item.data.label === options.preferredLabel) {
        if (!snapSameLabel) return;
        if (!closestIsSameLabel) {
          closestIsSameLabel = true;
          countAsClosest = true;
        }
      }

      // Ignore if label doesn't match and an object with the same label has been found
      else if (options.preferSameLabel && closestIsSameLabel) return;

      if (item instanceof paper.PathItem) {
        const closest = item.getNearestLocation(point);

        let itemClosestPoint: paper.Point;
        // If snapping to ends only, use hit point as-is
        if (options.endsOnly) itemClosestPoint = hitPoint;
        // Otherwise prefer snapping to segments, not arbitrary points on the path (prevents messy edges)
        else itemClosestPoint = point.getDistance(closest.segment.point) <= tolerance ? closest.segment.point : closest.point;

        // Update closest point
        const distance = point.getDistance(itemClosestPoint);
        if (distance < closestDistance || countAsClosest) {
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
export function convertToShape(path: paper.Path): paper.Path[] {
    let shapes: paper.Path[] = [];
    // Close path, then convert to shape
    path.closePath();
    let pathAsShape = path.unite(undefined);
    path.replaceWith(pathAsShape);

    // If path has no segments, remove it and return undefined
    if (pathAsShape instanceof paper.Path && pathAsShape.segments.length === 0) {
      pathAsShape.remove();
      return [];
    }

    // Copy data from original path
    pathAsShape.data = { ...path.data };
    if (pathAsShape instanceof paper.CompoundPath) {
      shapes = flattenCompoundPath(pathAsShape);
    }
    else shapes = [pathAsShape as paper.Path];

    // Remove initial shape: shapes can be reinserted if needed
    pathAsShape.remove();

    return shapes;
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
      // Don't allow compound paths (flatten if possible, otherwise ignore area erase)
      if (newItem instanceof paper.CompoundPath) {
        const newItemChildren = flattenCompoundPath(newItem)
        newItemChildren.forEach((child) => newItem.parent.addChild(child));
        // Only erase if flattened (otherwise revert)
        if (newItemChildren.length) {
          erased = true;
          item.remove();
          const unlabeledArea = item.intersect(path, { insert: false });
          unlabeledArea.data = { ...path.data };

          addToUnlabeledArea(unlabeledArea, layer);
        }
        newItem.remove();
      }
      else {
        const unlabeledArea = item.intersect(path, { insert: false });
        unlabeledArea.data = { ...path.data };
        item.replaceWith(newItem);
        addToUnlabeledArea(unlabeledArea, layer);
        newItem.data = { ...item.data };
        if (newItem instanceof paper.Path && newItem.segments.length === 0) newItem.remove();

        // Determine if anything was actually erased
        erased = erased || !newItem.compare(item);
      }
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

      // Split normal Path items: note the order of terms here to avoid short-circuit evaluation
      if (item instanceof paper.Path) sliced = sliceItem(item) || sliced;
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
    });

    return detectedItem;
}
