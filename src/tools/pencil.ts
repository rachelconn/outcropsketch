import paper from 'paper';
import store from '..';
import { Cursor } from '../classes/cursors/cursors';
import { LabelType } from '../classes/labeling/labeling';
import Layer from '../classes/layers/layers';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { setCursor, setToolOptions } from '../redux/actions/options';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { snapToNearby } from '../utils/paperLayers';

export interface PencilProps {
  layer: Layer,
  strokeColor?: paper.Color;
  strokeWidth?: number;
  strokeCap?: string;
  label?: string;
}

export default function createPencilTool(props: PencilProps): paper.Tool {
  const tool = new paper.Tool();
  let path: paper.Path;

  const addToPath = (event: paper.ToolEvent) => {
    const point = props.layer in LabelType ? snapToNearby(event.point, path) : event.point;
    path.add(point);
  };

  tool.onMouseDown = (event: paper.ToolEvent) => {
    // activate the layer this tool is supposed to use
    paper.project.layers[props.layer].activate();

    // set path properties based on tool props
    path = new paper.Path();
    path.strokeColor = props.strokeColor ?? new paper.Color('black');
    path.strokeWidth = props.strokeWidth ?? 3;
    path.strokeCap = props.strokeCap ?? 'round';

    // start writing
    addToPath(event);
  };

  tool.onMouseDrag = (event: paper.ToolEvent) => {
    addToPath(event);
  };

  tool.onMouseUp = () => {
    // Add state to undo history
    store.dispatch(addStateToHistory());
  }

  // Override activate function to set appropriate tool options
  const originalActivate = tool.activate;
  tool.activate = () => {
    originalActivate.call(tool);

    const toolOptions: ToolOption[] = props.layer in LabelType ? [
      ToolOption.SNAP, ToolOption.SNAP_SAME_LABEL,
    ] : [];
    store.dispatch(setToolOptions(toolOptions));
    store.dispatch(setCursor(Cursor.PENCIL));
  };

  return tool;
};
