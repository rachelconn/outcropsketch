import paper from 'paper';
import store from '..';
import { LabelType } from '../classes/labeling/labeling';
import Layer from '../classes/layers/layers';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { setToolOptions } from '../redux/actions/options';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { handleOverlap, snapToNearby } from '../utils/paperLayers';

export interface FillLassoProps {
  layer: Layer,
  strokeColor?: paper.Color;
  fillColor?: paper.Color;
  strokeWidth?: number;
  strokeCap?: string;
  textOnHover?: string;
}

// Layers to check when overwriting
const LAYERS_TO_OVERWRITE = new Set<Layer>([LabelType.STRUCTURE, LabelType.NONGEOLOGICAL]);

export default function createFillLassoTool(props: FillLassoProps): paper.Tool {
  const tool = new paper.Tool();

  let path: paper.Path;

  tool.onMouseDown = (event: paper.ToolEvent) => {
    // Activate the layer this tool is supposed to use
    paper.project.layers[props.layer].activate();

    // Set path properties based on tool props
    path = new paper.Path();
    path.strokeColor = props.strokeColor ?? new paper.Color('black');
    path.fillColor = props.fillColor ?? new paper.Color('grey');
    path.strokeWidth = props.strokeWidth ?? 3;
    path.strokeCap = props.strokeCap ?? 'round';

    // Start drawing
    path.add(snapToNearby(event.point, path));
  };

  tool.onMouseDrag = (event: paper.ToolEvent) => {
    path.add(snapToNearby(event.point, path));
  };

  tool.onMouseUp = () => {
    // Make path into shape by closing it, then removing self-intersections with unite()
    path.closePath();
    let pathAsShape = path.unite(undefined);
    pathAsShape.data.labelText = props.textOnHover;
    path.remove();


    // Merge with identical labels and overwrite different labels of the same type (if desired)
		const overwrite = store.getState().options.toolOptionValues[ToolOption.OVERWRITE];
    pathAsShape = handleOverlap(pathAsShape, props.layer, overwrite);

    // Overwrite other layers if needed
    if (overwrite) {
      const otherLayersToCheck = new Set(LAYERS_TO_OVERWRITE);
      otherLayersToCheck.delete(props.layer);
      otherLayersToCheck.forEach((layer) => {
        pathAsShape = handleOverlap(pathAsShape, layer, overwrite);
      });
    }

    // Add state to undo history
    store.dispatch(addStateToHistory());
  }

  // Override activate function to set appropriate tool options
  const originalActivate = tool.activate;
  tool.activate = () => {
    originalActivate.call(tool);

    store.dispatch(setToolOptions([ToolOption.SNAP, ToolOption.OVERWRITE]));
  };

  return tool;
}
