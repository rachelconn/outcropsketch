import paper from 'paper';
import store from '..';
import { Cursor } from '../classes/cursors/cursors';
import { NonLabelType } from '../classes/layers/layers';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { findLabelAtPoint, labelLayers } from '../utils/paperLayers';
import createTool from './createTool';

export default function createLabelViewerTool(): paper.Tool {
  let labelGroup: paper.Group;
  let lastHoveredItem: paper.Path;

  const onMouseMove = (e: paper.ToolEvent) => {
    const hoveredItem = findLabelAtPoint(e.point);
    // If nothing was hovered, simply remove the label text
    if (!hoveredItem) {
      labelGroup?.remove();
      return;
    }
    // If a label was being shown for the same item before, do nothing and prevent rerender
    if (hoveredItem === lastHoveredItem) return;

    // A new item was hovered, remove the old label text and make a new one
    labelGroup?.remove();
    labelGroup = new paper.Group();

    // Determine label properties: don't place if there is no label or color is white
    const label = hoveredItem.data.label;
    let fillColor = hoveredItem.strokeColor || hoveredItem.parent.strokeColor;
    // If item has no color (ie it is a CompoundPath child), use parent's
    if (!fillColor || fillColor.gray > 0.999) fillColor = hoveredItem.parent.strokeColor;
    if (!label || !fillColor) return;

    // Create text
    const labelText = new paper.PointText({
      content: label,
      point: hoveredItem.bounds.topCenter,
      justification: 'center',
      fillColor,
      fontFamily: 'Roboto',
      fontSize: 18,
    });
    labelText.parent = labelGroup;

    // Create border to increase text legibility
    const borderBox = new paper.Path.Rectangle({
      from: [labelText.bounds.left - 2, labelText.bounds.top],
      to: [labelText.bounds.right + 2, labelText.bounds.bottom],
      fillColor: 'white',
      strokeColor: 'black',
      strokeWidth: 1,
      parent: labelText,
    });
    borderBox.parent = labelGroup;
    borderBox.insertBelow(labelText);
  };

  // Remove label on deactivate to prevent "phantom" label text
  const onDeactivate = () => {
    labelGroup?.remove();
  };

  return createTool({
    cursor: Cursor.HELP,
    layer: NonLabelType.TOOL,
    toolOptions: [],
    onMouseMove,
    onDeactivate,
  });
}
