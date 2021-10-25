import paper from 'paper';
import store from '..';
import { Cursor } from '../classes/cursors/cursors';
import { NonLabelType } from '../classes/layers/layers';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { addToUnlabeledArea } from '../utils/paperLayers';
import createTool from './createTool';

export default function createEraserTool(): paper.Tool {
  function erase(point: paper.Point) {
    // Determine radius to erase
    const state = store.getState();
    const { scale } = state.image;
    const tolerance = state.options.toolOptionValues[ToolOption.ERASER_TOLERANCE] / scale;

    const hitTestOptions = {
      stroke: true,
      fill: true,
      tolerance,
    };

    let didErase = false;

    // Delete all items within range of the cursor
    paper.project.hitTestAll(point, hitTestOptions).forEach(({ item, type }) => {
      // Don't erase items from transparent layers or those from layers not made by the user
      if (item.layer.opacity === 0 || item.layer.name === NonLabelType.TOOL || item.layer.name === NonLabelType.UNLABELED_AREA) return;

      // If an item isn't filled and its fill is hit rather than the stroke, don't erase
      if (type === 'fill' && item.fillColor === undefined) return;

      addToUnlabeledArea(item as paper.PathItem);
      item.remove();
      didErase = true;
    });

    // Add state to undo history (if any items were erased)
    if (didErase) store.dispatch(addStateToHistory());
  }

  const onMouseDown = (event: paper.ToolEvent) => {
    erase(event.point);
  };

  const onMouseDrag = (event: paper.ToolEvent) => {
    erase(event.point);
  };

  return createTool({
    cursor: Cursor.ERASER,
    toolOptions: [ToolOption.ERASER_TOLERANCE],
    onMouseDown,
    onMouseDrag,
  });
}
