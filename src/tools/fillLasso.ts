import paper from 'paper';
import store from '..';
import { LabelType } from '../classes/labeling/labeling';
import Layer from '../classes/layers/layers';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { handleOverlap } from '../utils/paperLayers';

export interface FillLassoProps {
  layer: Layer,
  overwrite: boolean;
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
    path.add(event.point);
  };

  tool.onMouseDrag = (event: paper.ToolEvent) => {
    path.add(event.point);
  };

  tool.onMouseUp = () => {
    // Make path into shape by closing it, then removing self-intersections with unite()
    path.closePath();
    let pathAsShape = path.unite(undefined);
    pathAsShape.data.labelText = props.textOnHover;
    path.remove();


    // Merge with identical labels and overwrite different labels of the same type (if desired)
    pathAsShape = handleOverlap(pathAsShape, props.layer, props.overwrite);

    // Overwrite other layers if needed
    if (props.overwrite) {
      const otherLayersToCheck = new Set(LAYERS_TO_OVERWRITE);
      otherLayersToCheck.delete(props.layer);
      otherLayersToCheck.forEach((layer) => {
        pathAsShape = handleOverlap(pathAsShape, layer, props.overwrite);
      });
    }

    // Add state to undo history
    store.dispatch(addStateToHistory());
  }

  return tool;
}
