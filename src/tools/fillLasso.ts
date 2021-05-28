import paper from 'paper';
import Layer from '../classes/layers/layers';
import addLabel from '../utils/addLabel';

export interface FillLassoProps {
  layer: Layer,
  overwrite: boolean;
  strokeColor?: paper.Color;
  fillColor?: paper.Color;
  strokeWidth?: number;
  strokeCap?: string;
  textOnHover?: string;
}

export default function createFillLassoTool(props: FillLassoProps): paper.Tool {
  const tool = new paper.Tool();

  let path: paper.Path;

  tool.onMouseDown = (event: paper.ToolEvent) => {
    // Activate the layer this tool is supposed to use
    paper.project.layers[props.layer].activate();

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

  tool.onMouseUp = () => {
    // Make path into shape by closing it, then removing self-intersections with unite()
    path.closePath();
    let pathAsShape = path.unite(undefined);
    pathAsShape.data.labelText = props.textOnHover;
    path.remove();

    // Make path show appropriate text when hovered
    if (props.textOnHover) {
      addLabel(path, props.textOnHover);
    }
  }

  return tool;
}
