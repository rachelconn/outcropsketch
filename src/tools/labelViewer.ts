import paper from 'paper-jsdom-canvas';
import { Cursor } from '../classes/cursors/cursors';
import { NonLabelType } from '../classes/layers/layers';
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
    // Only create a new label if a new item was hovered
    if (hoveredItem !== lastHoveredItem) {
      // A new item was hovered, remove the old label text and make a new one
      labelGroup?.remove();
      labelGroup = new paper.Group();

      // Determine label properties: don't place if there is no label or color is white
      const label = hoveredItem.data.labelText;
      let fillColor = hoveredItem.strokeColor || hoveredItem.parent.strokeColor;
      // If item has no color (ie it is a CompoundPath child), use parent's
      if (!fillColor || fillColor.gray > 0.999) fillColor = hoveredItem.parent.strokeColor;
      if (!label || !fillColor) return;

      // Create text
      const labelText = new paper.PointText({
        content: label,
        justification: 'center',
        fillColor,
        fontFamily: 'Roboto',
        fontSize: 18,
        name: 'text',
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
        name: 'border',
      });
      borderBox.parent = labelGroup;
      borderBox.insertBelow(labelText);
    }

    // Move label to the correct position (regardless of if it was newly placed or not)
    const border: paper.Item = labelGroup.children['border'];
    const newPosition = new paper.Point(e.point.x + border.bounds.width / 2, e.point.y - border.bounds.height / 2);
    // Make sure new position fits within the canvas
    if (newPosition.x + border.bounds.width > paper.project.view.bounds.right) newPosition.x = e.point.x - border.bounds.width / 2;
    if (newPosition.y - border.bounds.height < paper.project.view.bounds.top) newPosition.y = e.point.y + border.bounds.height / 2;
    labelGroup.position = newPosition;
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
