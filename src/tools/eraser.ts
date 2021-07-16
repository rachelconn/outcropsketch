import paper from 'paper';
import store from '..';
import { NonLabelType } from '../classes/layers/layers';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { setToolOptions } from '../redux/actions/options';
import { addStateToHistory } from '../redux/actions/undoHistory';

export default function createEraserTool(): paper.Tool {
  const tool = new paper.Tool();

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

    const eraseCompoundPathChild = (item: paper.Item) => {
      // CompoundPaths have multiple children, if the removed item is one of these,
      // then remove other children that represent holes/exclusions in the CompoundPath
      const itemClockwise = (item as paper.PathItem).clockwise;
      const compoundPathItems = item.parent.children as paper.PathItem[];

      // Must iterate backwards since item.remove() results in item being removed from children
      for (let i = compoundPathItems.length - 1; i >= 0; i--) {
        const child = compoundPathItems[i];

        // Opposite winding direction indicates that child should be a hole within the path
        if (child === item || child.clockwise === itemClockwise) continue;

        // Don't remove if child is not contained within the item,
        // since it represents a hole within a different part of the path
        if (child !== item && item.bounds.contains(child.bounds)) {
          child.remove();
        }
      }

      item.remove();
      didErase = true;
    };

    // Delete all items within range of the cursor
    paper.project.hitTestAll(point, hitTestOptions).forEach(({ item, type }) => {
      // Don't erase label text, must erase the item it's labeling instead
      if (item.layer.name == NonLabelType.LABEL_TEXT) return;

      // If an item isn't filled and its fill is hit rather than the stroke, don't erase
      if (type === 'fill' && item.fillColor === undefined) return;

      // Handle compound paths
      if (item instanceof paper.CompoundPath) {
        for (let i = item.children.length - 1; i >= 0; i--) {
          const child = item.children[i];
          if (child?.hitTest(point, hitTestOptions)) eraseCompoundPathChild(child);
        }
      }
      else if (item.parent instanceof paper.CompoundPath) eraseCompoundPathChild(item);
      else {
        item.remove();
        didErase = true;
      }
    });

    // Add state to undo history (if any items were erased)
    if (didErase) store.dispatch(addStateToHistory());
  }

  tool.onMouseDown = (event: paper.ToolEvent) => {
    erase(event.point);
  };

  tool.onMouseDrag = (event: paper.ToolEvent) => {
    erase(event.point);
  };

  // Override activate function to set appropriate tool options
  const originalActivate = tool.activate;
  tool.activate = () => {
    originalActivate.call(tool);

    store.dispatch(setToolOptions([ToolOption.ERASER_TOLERANCE]));
  };

  return tool;
}
