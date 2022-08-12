import paper from 'paper-jsdom-canvas';
import store from '..';
import { Cursor } from '../classes/cursors/cursors';
import { LabelType } from '../classes/labeling/labeling';
import Layer, { NonLabelType } from '../classes/layers/layers';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { convertToShape, handleOverlap, removeFromUnlabeledArea, snapToNearby, flattenCompoundPath, scaleToZoom } from '../utils/paperLayers';
import createTool from './createTool';

export interface FillLassoProps {
  layer: Layer,
  strokeColor?: paper.Color;
  fillColor?: paper.Color;
  strokeWidth?: number;
  strokeCap?: string;
  label?: string;
  labelText?: string;
}

// Layers to check when overwriting
const LAYERS_TO_OVERWRITE = new Set<Layer>([LabelType.STRUCTURE, LabelType.NONGEOLOGICAL]);

export default function createFillLassoTool(props: FillLassoProps): paper.Tool {
  let path: paper.Path;
  // Whether currently drawing with click per point
  let currentlyDrawing = false;
  let closePathCircle: paper.Path;
  let pathIndicatorShape: paper.Path;

  // Sets the active path to a new one
  const createNewPath = (point: paper.Point) => {
    // Set path properties based on tool props
    paper.project.layers[NonLabelType.TOOL].activate();
    path = new paper.Path();
    paper.project.layers[props.layer].activate();
    path.strokeColor = props.strokeColor ?? new paper.Color('black');
    path.fillColor = props.fillColor ?? new paper.Color('grey');
    path.strokeWidth = props.strokeWidth ?? 3;
    path.strokeCap = props.strokeCap ?? 'round';
    path.data.label = props.label;
    path.data.labelText = props.labelText;

    // Start drawing
    path.add(snapToNearby(point, { exclude: path, toleranceOption: ToolOption.SNAP }).point);
  }

  const addPointToPath = (point: paper.Point) => {
    path.add(snapToNearby(point, { exclude: path, toleranceOption: ToolOption.SNAP }).point);
  };

  const closePath = () => {
    // Save current state to restore in case insertion is invalid
    const originalState = paper.project.exportJSON();

    let shapes = convertToShape(path);
    path = undefined;
    let shouldRestore = false;
    if (shapes.length > 0) {
      shapes.forEach((shape) => {
        paper.project.layers[props.layer].addChild(shape)
      });

      // Merge with identical labels and overwrite different labels of the same type (if desired)
      const otherLayersToCheck = new Set(LAYERS_TO_OVERWRITE);
      otherLayersToCheck.delete(props.layer);
      const layersToCheck = [props.layer, ...Array.from(otherLayersToCheck)];
      shapes.forEach((shape) => {
        if (shouldRestore) return;
        let newShape: paper.PathItem = shape;
        layersToCheck.forEach((layer) => {
          if (shouldRestore) return;
          newShape = handleOverlap(newShape, layer);
          if (newShape === undefined) shouldRestore = true;
        });

        // Flatten compound path if possible
        if (newShape instanceof paper.CompoundPath) {
          const children = flattenCompoundPath(newShape);
          if (children.length) {
            children.forEach((child) => {
              if (Math.abs(child.area) > 1) paper.project.layers[props.layer].addChild(child);
            });
            newShape.remove();
            shape.remove();
          }
          else {
            // Path cannot be simplified and is invalid
            shouldRestore = true;
          }
        }

        // Update unlabeled area
        removeFromUnlabeledArea(newShape);

        // If shape has no area, remove it
        if (shape.area === 0 || shape.segments.length === 0) shape.remove();
      });
    }

    if (closePathCircle) {
      closePathCircle.remove();
      closePathCircle = undefined;
    }
    if (pathIndicatorShape) {
      pathIndicatorShape.remove();
      pathIndicatorShape = undefined;
    }

    if (shouldRestore) {
      paper.project.clear();
      paper.project.importJSON(originalState);
      paper.project.layers[NonLabelType.TOOL].removeChildren();
    }
    // Add state to undo history if valid
    else if (shapes.length > 0) store.dispatch(addStateToHistory());
  };

  const onMouseDown = (event: paper.ToolEvent) => {
    const clickPerPoint = store.getState().options.toolOptionValues[ToolOption.CLICK_PER_POINT];

    if (clickPerPoint) {
      if (currentlyDrawing) {
        // Circle to close path being present indicates that the path should be closed on click
        if (closePathCircle) {
          currentlyDrawing = false;
          closePath();
        }
        else {
          addPointToPath(event.point);
          pathIndicatorShape.removeSegment(1)
          pathIndicatorShape.insert(1, new paper.Segment(path.lastSegment.point));
          pathIndicatorShape.strokeColor = undefined;
        }
      }
      else {
        createNewPath(event.point);
        pathIndicatorShape = new paper.Path({
          fillColor: props.fillColor,
          strokeColor: props.strokeColor,
          strokeWidth: 3,
          insert: false,
        });
        paper.project.layers[NonLabelType.TOOL].addChild(pathIndicatorShape);
        // Temporarily use strokeColor to show where second point will be placed
        pathIndicatorShape.add(
          path.segments[0].point,
          path.segments[0].point,
          path.segments[0].point,
        );
        currentlyDrawing = true;
      }
    }
    else {
      createNewPath(event.point);
    }
  };

  const onMouseDrag = (event: paper.ToolEvent) => {
    const clickPerPoint = store.getState().options.toolOptionValues[ToolOption.CLICK_PER_POINT];

    if (!clickPerPoint) {
      addPointToPath(event.point);
    }
  };

  const onMouseMove = (event: paper.ToolEvent) => {
    if (!path) return;
    const clickPerPoint = store.getState().options.toolOptionValues[ToolOption.CLICK_PER_POINT];

    if (clickPerPoint) {
      pathIndicatorShape.removeSegment(2);
      pathIndicatorShape.insert(2, new paper.Segment(event.point));
      if (path.segments.length >= 2) {
        const initialPoint = path.segments[0].point;
        // Draw circle to close if within range
        const maxDistance = scaleToZoom(15);
        if (scaleToZoom(event.point.getDistance(initialPoint)) < maxDistance) {
          if (closePathCircle) return;
          closePathCircle = new paper.Path.Circle({
            center: initialPoint,
            radius: maxDistance,
            strokeColor: new paper.Color('#ffff00'),
            strokeWidth: 1,
            insert: false,
          });
          paper.project.layers[NonLabelType.TOOL].addChild(closePathCircle);
        }
        else {
          closePathCircle?.remove();
          closePathCircle = undefined;
        }
      }
    }

    else if (currentlyDrawing) {
      currentlyDrawing = false;
      path.remove();
      path = undefined;
      closePathCircle?.remove();
      closePathCircle = undefined;
      pathIndicatorShape?.remove();
      pathIndicatorShape = undefined;
    }
  };

  const onMouseUp = () => {
    const clickPerPoint = store.getState().options.toolOptionValues[ToolOption.CLICK_PER_POINT];

    if (!clickPerPoint) {
      closePath();
    }
  }

  const onDeactivate = () => {
    if (currentlyDrawing) {
      closePath();
      currentlyDrawing = false;
    }
  };

  return createTool({
    cursor: Cursor.AREA_LASSO,
    layer: props.layer,
    toolOptions: [ToolOption.SNAP, ToolOption.SNAP_SAME_LABEL, ToolOption.MERGE, ToolOption.OVERWRITE, ToolOption.CLICK_PER_POINT],
    onMouseDown,
    onMouseDrag,
    onMouseMove,
    onMouseUp,
    onDeactivate,
  });
}
