import paper from 'paper';
import store from '..';
import Layer from '../classes/layers/layers';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { setToolOptions } from '../redux/actions/options';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { snapToNearby } from '../utils/paperLayers';

export interface PencilProps {
  layer: Layer,
  strokeColor?: paper.Color;
  strokeWidth?: number;
  strokeCap?: string;
  textOnHover?: string;
}

export default function createPencilTool(props: PencilProps): paper.Tool {
  const tool = new paper.Tool();
  let path: paper.Path;

  tool.onMouseDown = (event: paper.ToolEvent) => {
    // activate the layer this tool is supposed to use
    paper.project.layers[props.layer].activate();

    // set path properties based on tool props
    path = new paper.Path();
    path.strokeColor = props.strokeColor ?? new paper.Color('black');
    path.strokeWidth = props.strokeWidth ?? 3;
    path.strokeCap = props.strokeCap ?? 'round';

    // start writing
    path.add(snapToNearby(event.point, path));
  };

  tool.onMouseDrag = (event: paper.ToolEvent) => {
    path.add(snapToNearby(event.point, path));
  };

  tool.onMouseUp = () => {
    // Add state to undo history
    store.dispatch(addStateToHistory());
  }

  // Override activate function to set appropriate tool options
  const originalActivate = tool.activate;
  tool.activate = () => {
    originalActivate.call(tool);

    store.dispatch(setToolOptions([ToolOption.SNAP]));
  };

  return tool;
};
