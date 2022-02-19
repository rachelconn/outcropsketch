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
  labelText?: string;
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
      preferSameLabel: true,
      // If continuing surfaces, only snap to the ends
      endsOnly: store.getState().options.toolOptionValues[ToolOption.CONTINUE_SURFACES],
      preferredLabel: props.label,
      // TODO: change option for tolerance to snap, use continue surfaces as a toggle
      toleranceOption: ToolOption.SNAP,
    });
  }

  // Remove closest path indicator when tool is deactivated
  const onDeactivate = () => {
    closestPathCircle?.remove();
  };

  // Show user when paths will be continued
  const onMouseMove = (event: paper.ToolEvent) => {
    const toolOptionValues = store.getState().options.toolOptionValues;
    // Don't show if currently drawing a path, or canContinue or CONTINUE_SURFACES isn't set
    if (!props.canContinue || holdingMouse || !toolOptionValues[ToolOption.CONTINUE_SURFACES]) return;

    // Remove previous closest path indicator
    closestPathCircle?.remove();

    // Find the closest path (cool paper.js quirk: event.point is reevaluated on access so it must be saved here for the comparison later)
    const originalPoint = event.point;
    const { point: closestPathPoint, path: closestPath } = snap(originalPoint);

    // Do nothing if no points are close enough to snap to (or if an item with a different label was snapped to)
    if (closestPathPoint === originalPoint || closestPath.data.label !== props.label) return;

    // Show closest point
    closestPathCircle = new paper.Path.Circle({
      center: closestPathPoint,
      radius: scaleToZoom(toolOptionValues[ToolOption.SNAP]),
      strokeColor: new paper.Color('#00ffff'),
      strokeWidth: 1,
      insert: false,
    });
    paper.project.layers[NonLabelType.TOOL].addChild(closestPathCircle);
  };

  const onMouseDown = (event: paper.ToolEvent) => {
    holdingMouse = true;
    // Remove closest path indicator since the mouse is now being held
    closestPathCircle?.remove();

    // Set path properties based on tool props
    const { point: snappedPoint, path: snappedPath } = snap(event.point);
    // Add on to snapped path (if there is one and the option is set)
    if (
      snappedPath
      && snappedPath instanceof paper.Path
      && snappedPath.data.label === props.label
      && store.getState().options.toolOptionValues[ToolOption.CONTINUE_SURFACES]
    ) {
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
      path.data.labelText = props.labelText;
    }

    // Draw onto correct path (continue surface seamlessly if snapped, otherwise snap to point)
    path.add(path === snappedPath ? event.point : snappedPoint);
  };

  const onMouseDrag = (event: paper.ToolEvent) => {
    path.add(snap(event.point).point);
  };

  const onMouseUp = () => {
    holdingMouse = false;
    path.parent = paper.project.layers[props.layer];

    // Add state to undo history unless the path is empty/invisible
    if (path.segments.length >= 2) store.dispatch(addStateToHistory());
    else path.remove();

    // Done drawing path, stop keeping track of it
    path = undefined;
  }

  return createTool({
    cursor: Cursor.PENCIL,
    layer: props.layer,
    toolOptions: [ToolOption.SNAP, ToolOption.CONTINUE_SURFACES],
    onDeactivate,
    onMouseMove,
    onMouseDown,
    onMouseDrag,
    onMouseUp,
  });
};
