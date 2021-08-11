import paper from 'paper';
import { Cursor } from '../classes/cursors/cursors';
import { canvasContainerID } from '../components/SketchCanvas/SketchCanvas';
import createTool from './createTool';

export default function createPanTool(): paper.Tool {
  const onMouseDrag = (event: paper.ToolEvent) => {
    const positionDelta = event.downPoint.subtract(event.point);
    const canvasContainer = document.getElementById(canvasContainerID);
    canvasContainer.scrollBy(positionDelta.x, positionDelta.y);
  }

  return createTool({
    cursor: Cursor.GRAB,
    toolOptions: [],
    onMouseDrag,
  });
}
