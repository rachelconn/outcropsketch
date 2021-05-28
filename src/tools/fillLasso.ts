import paper from 'paper';
import Layer from '../classes/layers/layers';

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

    // Merge with identical labels and overwrite different labels of the same type (if desired)
    const itemsForLayer: paper.PathItem[] = paper.project.layers[props.layer].children;
    itemsForLayer.forEach((item) => {
      // Do nothing for the path being drawn and non-intersecting items
      if (item === pathAsShape || !item.bounds.intersects(pathAsShape.bounds)) return;

      // Merge with paths for the same label
      if (pathAsShape.strokeColor.equals(item.strokeColor)) {
        const merged = item.unite(pathAsShape);
        item.replaceWith(merged);
        merged.data = { ...pathAsShape.data };
        pathAsShape.remove();
        pathAsShape = merged;
      }

      // Overwrite previous other labels if needed
      else if (props.overwrite) {
        const diff = item.subtract(pathAsShape);
        diff.data = { ...item.data };
        item.replaceWith(diff);

        if (diff instanceof paper.CompoundPath) {
          // Path was split into multiple parts, give each child the correct data
          diff.children.forEach((child) => child.data = { ...diff.data });
        }
      }
    });
  }

  return tool;
}
