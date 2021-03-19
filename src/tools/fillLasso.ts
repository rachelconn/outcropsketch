import paper from 'paper';

export interface FillLassoProps {
  strokeColor?: paper.Color;
  fillColor?: paper.Color;
  strokeWidth?: number;
  strokeCap?: string;
}

export default function createFillLassoTool(props: FillLassoProps = {}): paper.Tool {
  const tool = new paper.Tool();

  let path: paper.Path;

  tool.onMouseDown = (event: paper.ToolEvent) => {
    // Set path properties based on tool props
    path = new paper.Path();
    path.strokeColor = props.strokeColor ?? new paper.Color('black');
    path.fillColor = props.fillColor ?? new paper.Color('grey');
    path.strokeWidth = props.strokeWidth ?? 3;
    path.strokeCap = props.strokeCap ?? 'round';

    // Start drawing
    path.add(event.point);
  };

  tool.onMouseDrag = (event: paper.ToolEvent) => {
    path.add(event.point);
  };

  tool.onMouseUp = (event: paper.ToolEvent) => {
    path.closePath();
  };

  return tool;
}