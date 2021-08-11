import paper from 'paper';
import store from '..';
import { Cursor } from '../classes/cursors/cursors';
import { LabelType } from '../classes/labeling/labeling';
import Layer from '../classes/layers/layers';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { convertToShape, handleOverlap, snapToNearby } from '../utils/paperLayers';
import createTool from './createTool';

export interface FillLassoProps {
  layer: Layer,
  strokeColor?: paper.Color;
  fillColor?: paper.Color;
  strokeWidth?: number;
  strokeCap?: string;
  label?: string;
}

// Layers to check when overwriting
const LAYERS_TO_OVERWRITE = new Set<Layer>([LabelType.STRUCTURE, LabelType.NONGEOLOGICAL]);

export default function createFillLassoTool(props: FillLassoProps): paper.Tool {
  let path: paper.Path;

  const onMouseDown = (event: paper.ToolEvent) => {
    // Activate the layer this tool is supposed to use
    paper.project.layers[props.layer].activate();

    // Set path properties based on tool props
    path = new paper.Path();
    path.strokeColor = props.strokeColor ?? new paper.Color('black');
    path.fillColor = props.fillColor ?? new paper.Color('grey');
    path.strokeWidth = props.strokeWidth ?? 3;
    path.strokeCap = props.strokeCap ?? 'round';
    path.data.label = props.label;

    // Start drawing
    path.add(snapToNearby(event.point, { exclude: path, toleranceOption: ToolOption.SNAP }).point);
  };

  const onMouseDrag = (event: paper.ToolEvent) => {
    path.add(snapToNearby(event.point, { exclude: path, toleranceOption: ToolOption.SNAP }).point);
  };

  const onMouseUp = () => {
    let pathAsShape = convertToShape(path);
    if (pathAsShape === undefined) return;

    // Merge with identical labels and overwrite different labels of the same type (if desired)
    pathAsShape = handleOverlap(pathAsShape, props.layer);

    // Overwrite other layers if needed
    const otherLayersToCheck = new Set(LAYERS_TO_OVERWRITE);
    otherLayersToCheck.delete(props.layer);
    otherLayersToCheck.forEach((layer) => {
      pathAsShape = handleOverlap(pathAsShape, layer);
    });

    // Add state to undo history
    store.dispatch(addStateToHistory());
  }

  return createTool({
    cursor: Cursor.AREA_LASSO,
    toolOptions: [ToolOption.SNAP, ToolOption.SNAP_SAME_LABEL, ToolOption.MERGE_SAME_LABEL, ToolOption.OVERWRITE],
    onMouseDown,
    onMouseDrag,
    onMouseUp,
  });
}
