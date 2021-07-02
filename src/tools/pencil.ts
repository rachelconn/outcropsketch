import paper from 'paper';
import store from '..';
import Layer from '../classes/layers/layers';
import { addStateToHistory } from '../redux/actions/undoHistory';

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
    path.add(event.point);
  };

  tool.onMouseDrag = (event: paper.ToolEvent) => {
    path.add(event.point);
  };

  tool.onMouseUp = () => {
    // Add state to undo history
    store.dispatch(addStateToHistory());
  }

  return tool;
};
