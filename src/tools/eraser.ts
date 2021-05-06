import paper from 'paper';

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
