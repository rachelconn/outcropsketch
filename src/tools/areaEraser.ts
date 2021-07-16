import paper from 'paper';
import store from '..';
import { setToolOptions } from '../redux/actions/options';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { convertToShape, eraseArea } from '../utils/paperLayers';

export default function createAreaEraserTool(): paper.Tool {
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
    const pathAsShape = convertToShape(path);
    const erased = eraseArea(pathAsShape);
    pathAsShape.remove();

    if (erased) store.dispatch(addStateToHistory());
  };

  // Override activate function to set appropriate tool options
  const originalActivate = tool.activate;
  tool.activate = () => {
    originalActivate.call(tool);

    store.dispatch(setToolOptions([]));
  };

  return tool;
}
