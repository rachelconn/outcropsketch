import paper from 'paper';
import store from '..';
import { NonLabelType } from '../classes/layers/layers';
import paperLayers from './paperLayers';

export function nameForItem(item: paper.Item) {
  return `#${item.id}`;
}

/**
 * Creates and returns a paper Group with text labeling a paper item
 * @param text Text to display on the label
 * @param item Item to display text over
 * @returns A paper Group for the created label
 */
function createLabelText(item: paper.Item, text: string): paper.Group {
  // Remember previous layer and draw on label text layer
  const originalLayer = paper.project.activeLayer;
  paper.project.layers[NonLabelType.LABEL_TEXT].activate();

  const labelGroup = new paper.Group();

  // Create text
  const labelText = new paper.PointText({
    content: text,
    point: item.bounds.topCenter,
    justification: 'center',
    fillColor: item.strokeColor,
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

  // Restore original layer
  originalLayer.activate();

  return labelGroup;
}

/**
 * Adds a label to an item that will show when it's hovered
 * @param item Item to apply label to
 * @param text Label text
 */
export default function addLabel(item: paper.Item, text: string) {
  // Create label
  const label = createLabelText(item, text);
  label.visible = store.getState().image.labelsVisible;

  // Set label name to allow easy access of item and its label
  const itemName = nameForItem(item)
  label.name = itemName;

  const labelTextLayer = paper.project.layers[NonLabelType.LABEL_TEXT];

  item.onMouseEnter = () => {
    labelTextLayer.children[itemName].visible = true;
  };

  item.onMouseLeave = () => {
    if (!store.getState().image.labelsVisible) {
      labelTextLayer.children[itemName].visible = false;
    }
  };
}

/**
 * Restores the connection between each item and its label after serialization + deserialization
 */
export function restoreLabels() {
  const labelTextLayer = paper.project.layers[NonLabelType.LABEL_TEXT];

  paperLayers.forEach((layer) => {
    paper.project.layers[layer].children.forEach((item) => {
      // Determine expected label name for each item
      const itemName = nameForItem(item);
      const label = labelTextLayer.children[itemName];

      // Restore mouse events for label
      if (label) {
        item.onMouseEnter = () => {
          label.visible = true;
        };

        item.onMouseLeave = () => {
          if (!store.getState().image.labelsVisible) {
            labelTextLayer.children[itemName].visible = false;
          }
        };
      }
    });
  });
}
