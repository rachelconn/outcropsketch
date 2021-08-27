import paper from 'paper';
import store from '..';
import { Cursor } from '../classes/cursors/cursors';
import Layer, { NonLabelType } from '../classes/layers/layers';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { scaleToZoom, snapToNearby, SnapToNearbyReturnValue } from '../utils/paperLayers';
import createTool from './createTool';

export interface PencilProps {
  layer: Layer,
  // canContinue: Whether editing of previous pencil paths should be allowed
  canContinue: boolean,
  strokeColor?: paper.Color;
  strokeWidth?: number;
  strokeCap?: string;
  label?: string;
}

export default function createPencilTool(props: PencilProps): paper.Tool {
  // Path to draw
  let path: paper.Path;
  let holdingMouse = false;
  // Circular path over the path to continue if option is set
  let closestPathCircle: paper.Path;

  function snap(point): SnapToNearbyReturnValue {
    if (!props.canContinue) return { point };
    return snapToNearby(point, {
      exclude: path,
      sameLabelOnly: true,
      endsOnly: true,
      toleranceOption: ToolOption.CONTINUE_SURFACES,
    });
  }

  // Remove closest path indicator when tool is deactivated
  const onDeactivate = () => {
    closestPathCircle?.remove();
  };

  // Show user when paths will be continued
  const onMouseMove = (event: paper.ToolEvent) => {
    // Don't show if currently drawing a path or canContinue isn't set
    if (!props.canContinue || holdingMouse) return;

    // Remove previous closest path indicator
    closestPathCircle?.remove();

    // Find the closest path (cool paper.js quirk: event.point is reevaluated on access so it must be saved here for the comparison later)
    const originalPoint = event.point;
    const closestPathPoint = snap(originalPoint).point;

    // Do nothing if no points are close enough to snap to
    if (closestPathPoint === originalPoint) return;

    // Show closest point
    closestPathCircle = new paper.Path.Circle({
      center: closestPathPoint,
      radius: scaleToZoom(store.getState().options.toolOptionValues[ToolOption.CONTINUE_SURFACES]),
      strokeColor: new paper.Color('#00ffff'),
      strokeWidth: 1,
      layer: NonLabelType.LABEL_TEXT,
    });
  };

  const onMouseDown = (event: paper.ToolEvent) => {
    holdingMouse = true;
    // Remove closest path indicator since the mouse is now being held
    closestPathCircle?.remove();

    // Set path properties based on tool props
    const { point: snappedPoint, path: snappedPath } = snap(event.point);
    // Add on to snapped path (if there is one)
    if (snappedPath && snappedPath instanceof paper.Path) {
      path = snappedPath;
      // Flip segments if the first segment was clicked rather than the last one, since
      // new segments will be added to the end
      if (!snappedPoint.equals(path.lastSegment.point)) path.segments.reverse();
    }
    else {
      path = new paper.Path();
      path.strokeColor = props.strokeColor ?? new paper.Color('black');
      path.strokeWidth = props.strokeWidth ?? 3;
      path.strokeCap = props.strokeCap ?? 'round';
      path.data.label = props.label;
    }

    // Draw onto correct path
    path.add(event.point);
  };

  const onMouseDrag = (event: paper.ToolEvent) => {
    path.add(event.point);
  };

  const onMouseUp = () => {
    holdingMouse = false;

    // Add state to undo history unless the path is empty/invisible
    if (path.segments.length >= 2) store.dispatch(addStateToHistory());
    else path.remove();
  }

  return createTool({
    cursor: Cursor.PENCIL,
    layer: props.layer,
    toolOptions: [ToolOption.CONTINUE_SURFACES],
    onDeactivate,
    onMouseMove,
    onMouseDown,
    onMouseDrag,
    onMouseUp,
  });
};
