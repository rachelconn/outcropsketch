import paper from 'paper-jsdom-canvas';
import { Cursor } from '../classes/cursors/cursors';
import { NonLabelType } from '../classes/layers/layers';
import { addStateToHistory } from '../redux/actions/undoHistory';
import store from '../redux/store';
import { sliceOnPath } from '../utils/paperLayers';
import createTool from './createTool';

export default function createSliceTool(): paper.Tool {
  let path: paper.Path;

  const onMouseDown = (event: paper.ToolEvent) => {
    // Create path on tool layer
    const activeLayer = paper.project.activeLayer;
    paper.project.layers[NonLabelType.TOOL].activate();
    path = new paper.Path();
    activeLayer.activate();

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
