import paper from 'paper';
import store from '..';
import { Cursor } from '../classes/cursors/cursors';
import { setCursor, setToolOptions } from '../redux/actions/options';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { sliceOnPath } from '../utils/paperLayers';

export default function createSliceTool(): paper.Tool {
  const tool = new paper.Tool();
  let path: paper.Path;

  tool.onMouseDown = (event: paper.ToolEvent) => {
    path = new paper.Path();
    path.strokeColor = new paper.Color('white');
    path.strokeWidth = 2;
    path.strokeCap = 'round';
    path.dashArray = [4, 4];

    path.add(event.point);
  };

  tool.onMouseDrag = (event: paper.ToolEvent) => {
    path.add(event.point);
  };

  tool.onMouseUp = () => {
    sliceOnPath(path);
    path.remove();

    store.dispatch(addStateToHistory());
  };

  // Override activate function to set appropriate tool options
  const originalActivate = tool.activate;
  tool.activate = () => {
    originalActivate.call(tool);

    store.dispatch(setToolOptions([]));
    store.dispatch(setCursor(Cursor.SCALPEL));
  };

  return tool;
}
