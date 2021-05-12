import paper from 'paper';
import { NonLabelType } from '../classes/layers/layers';
import { nameForItem } from '../utils/addLabel';

export interface EraserProps {
  radius?: number;
}

export default function createEraserTool(props: EraserProps = {}): paper.Tool {
  const tool = new paper.Tool();

  const hitTestOptions = {
    stroke: true,
    tolerance: props.radius ?? 1,
  };

  function erase(point: paper.Point) {
    // Delete all items within range of the cursor
    paper.project.hitTestAll(point, hitTestOptions).forEach(({ item }) => {
      // Don't erase label text, must erase the item it's labeling instead
      if (item.layer.name == NonLabelType.LABEL_TEXT) return;

      // Remove label for item if one exists
      const label = paper.project.layers[NonLabelType.LABEL_TEXT].children[nameForItem(item)];
      if (label) label.remove();

      item.remove();
    });
  }

  tool.onMouseDown = (event: paper.ToolEvent) => {
    erase(event.point);
  };

  tool.onMouseDrag = (event: paper.ToolEvent) => {
    erase(event.point);
  };

  return tool;
}
