import paper from 'paper';
import store from '..';
import { NonLabelType } from '../classes/layers/layers';
import { setToolOptions } from '../redux/actions/options';
import { addStateToHistory } from '../redux/actions/undoHistory';

export interface EraserProps {
  radius?: number;
}

export default function createEraserTool(props: EraserProps = {}): paper.Tool {
  const tool = new paper.Tool();

  const hitTestOptions = {
    stroke: true,
    fill: true,
    tolerance: props.radius ?? 1,
  };

  function erase(point: paper.Point) {
    let didErase = false;

    // Delete all items within range of the cursor
    paper.project.hitTestAll(point, hitTestOptions).forEach(({ item, type }) => {
      // Don't erase label text, must erase the item it's labeling instead
      if (item.layer.name == NonLabelType.LABEL_TEXT) return;

      // If an item isn't filled and its fill is hit rather than the stroke, don't erase
      if (type === 'fill' && item.fillColor === undefined) return;

      // CompoundPaths have multiple children, if the removed item is one of these,
      // then remove other children that represent holes/exclusions in the CompoundPath
      if (item.parent instanceof paper.CompoundPath) {
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
      }

      item.remove();
      didErase = true;
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

    store.dispatch(setToolOptions([]));
  };

  return tool;
}
