import paper from 'paper';
import store from '..';
import { Cursor } from '../classes/cursors/cursors';
import { NonLabelType } from '../classes/layers/layers';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { sliceOnPath } from '../utils/paperLayers';
import createTool from './createTool';

export default function createSliceTool(): paper.Tool {
  let path: paper.Path;

  const onMouseDown = (event: paper.ToolEvent) => {
    paper.project.layers[NonLabelType.TOOL].activate();
    path = new paper.Path();
    path.strokeColor = new paper.Color('white');
    path.strokeWidth = 2;
    path.strokeCap = 'round';
    path.dashArray = [4, 4];

    path.add(event.point);
  };

  const onMouseDrag = (event: paper.ToolEvent) => {
    path.add(event.point);
  };

  const onMouseUp = () => {
    const sliced = sliceOnPath(path);
    path.remove();

    // Add state to undo history only if something was sliced
    if (sliced) store.dispatch(addStateToHistory());
  };

  return createTool({
    cursor: Cursor.SCALPEL,
    toolOptions: [],
    onMouseDown,
    onMouseDrag,
    onMouseUp,
  });
}
