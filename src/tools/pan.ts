import paper from 'paper';
import store from '..';
import { Cursor } from '../classes/cursors/cursors';
import { canvasContainerID } from '../components/SketchCanvas/SketchCanvas';
import { setCursor, setToolOptions } from '../redux/actions/options';

export default function createPanTool(): paper.Tool {
  const tool = new paper.Tool();

  tool.onMouseDrag = (event: paper.ToolEvent) => {
    const positionDelta = event.downPoint.subtract(event.point);
    const canvasContainer = document.getElementById(canvasContainerID);
    canvasContainer.scrollBy(positionDelta.x, positionDelta.y);
  }

  // Override activate function to set appropriate tool options
  const originalActivate = tool.activate;
  tool.activate = () => {
    originalActivate.call(tool);

    store.dispatch(setToolOptions([]));
    store.dispatch(setCursor(Cursor.GRAB));
  };

  return tool;
}
