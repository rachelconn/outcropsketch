import paper from 'paper-jsdom-canvas';
import { Label, LabelType } from "../../classes/labeling/labeling";
import { StructureType, getStructureTypeColor, getStructureTypeName } from '../../classes/labeling/structureType';
import { SurfaceType, getSurfaceTypeColor, getSurfaceTypeName } from '../../classes/labeling/surfaceType';
import { NonGeologicalType, getNonGeologicalTypeColor, getNonGeologicalTypeName } from '../../classes/labeling/nonGeologicalType';
import { ADD_LABEL, AvailableLabelType, LabelsAction, REMOVE_LABEL, SET_ACTIVE_LABEL_TYPE, SET_LABELS, getLayerForLabelType } from '../actions/labels';
import createFillLassoTool from '../../tools/fillLasso';
import createPencilTool from '../../tools/pencil';

export interface Labels {
  activeLabelType: AvailableLabelType,
  labels: Label[],
  tools: Map<Label, paper.Tool>,
}

export const defaultLabels: Label[] = [
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.STRUCTURELESS),
    label: StructureType.STRUCTURELESS,
    labelText: getStructureTypeName(StructureType.STRUCTURELESS),
    labelType: LabelType.STRUCTURE,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.PLANAR_BEDDED),
    label: StructureType.PLANAR_BEDDED,
    labelText: getStructureTypeName(StructureType.PLANAR_BEDDED),
    labelType: LabelType.STRUCTURE,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.CROSS_BEDDED),
    label: StructureType.CROSS_BEDDED,
    labelText: getStructureTypeName(StructureType.CROSS_BEDDED),
    labelType: LabelType.STRUCTURE,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.GRADED),
    label: StructureType.GRADED,
    labelText: getStructureTypeName(StructureType.GRADED),
    labelType: LabelType.STRUCTURE,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.CONTORTED),
    label: StructureType.CONTORTED,
    labelText: getStructureTypeName(StructureType.CONTORTED),
    labelType: LabelType.STRUCTURE,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.UNKNOWN),
    label: StructureType.UNKNOWN,
    labelText: getStructureTypeName(StructureType.UNKNOWN),
    labelType: LabelType.STRUCTURE,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.COVERED),
    label: StructureType.COVERED,
    labelText: getStructureTypeName(StructureType.COVERED),
    labelType: LabelType.STRUCTURE,
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.EROSION),
    label: SurfaceType.EROSION,
    labelText: getSurfaceTypeName(SurfaceType.EROSION),
    labelType: LabelType.SURFACE,
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.FRACTURE),
    label: SurfaceType.FRACTURE,
    labelText: getSurfaceTypeName(SurfaceType.FRACTURE),
    labelType: LabelType.SURFACE,
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.FAULT),
    label: SurfaceType.FAULT,
    labelText: getSurfaceTypeName(SurfaceType.FAULT),
    labelType: LabelType.SURFACE,
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.PALEOSOL),
    label: SurfaceType.PALEOSOL,
    labelText: getSurfaceTypeName(SurfaceType.PALEOSOL),
    labelType: LabelType.SURFACE,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getNonGeologicalTypeColor(NonGeologicalType.PERSON),
    label: NonGeologicalType.PERSON,
    labelText: getNonGeologicalTypeName(NonGeologicalType.PERSON),
    labelType: LabelType.NONGEOLOGICAL,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getNonGeologicalTypeColor(NonGeologicalType.COMPASS),
    label: NonGeologicalType.COMPASS,
    labelText: getNonGeologicalTypeName(NonGeologicalType.COMPASS),
    labelType: LabelType.NONGEOLOGICAL,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getNonGeologicalTypeColor(NonGeologicalType.HAMMER),
    label: NonGeologicalType.HAMMER,
    labelText: getNonGeologicalTypeName(NonGeologicalType.HAMMER),
    labelType: LabelType.NONGEOLOGICAL,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getNonGeologicalTypeColor(NonGeologicalType.PENCIL),
    label: NonGeologicalType.PENCIL,
    labelText: getNonGeologicalTypeName(NonGeologicalType.PENCIL),
    labelType: LabelType.NONGEOLOGICAL,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getNonGeologicalTypeColor(NonGeologicalType.SKY),
    label: NonGeologicalType.SKY,
    labelText: getNonGeologicalTypeName(NonGeologicalType.SKY),
    labelType: LabelType.NONGEOLOGICAL,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getNonGeologicalTypeColor(NonGeologicalType.FOLIAGE),
    label: NonGeologicalType.FOLIAGE,
    labelText: getNonGeologicalTypeName(NonGeologicalType.FOLIAGE),
    labelType: LabelType.NONGEOLOGICAL,
  },
  {
    layer: LabelType.STRUCTURE,
    color: getNonGeologicalTypeColor(NonGeologicalType.MISC),
    label: NonGeologicalType.MISC,
    labelText: getNonGeologicalTypeName(NonGeologicalType.MISC),
    labelType: LabelType.NONGEOLOGICAL,
  },
];

/**
 * Creates a tool for the specified label and updates tools
 * @param label Label to add a tool for
 * @param tools Current state's tools prop
 * @param inPlace Whether tools' value should be modified directly or a shallow copy should be returned
 * @returns The updated tools Map
 */
function addToolForLabel(label: Label, tools: Map<Label, paper.Tool>, inPlace = false): Map<Label, paper.Tool> {
  const newTools = inPlace ? tools : new Map(tools);

  const strokeColor = new paper.Color(label.color);
  const fillColor = new paper.Color(strokeColor);
  fillColor.alpha /= 2;
  const tool = label.layer === LabelType.SURFACE ? createPencilTool({
    layer: label.layer,
    canContinue: true,
    strokeColor,
    label: label.label,
    labelText: label.labelText,
  }) : createFillLassoTool({
    layer: label.layer,
    strokeColor,
    fillColor,
    label: label.label,
    labelText: label.labelText,
  });

  // Add and activate new tool
  newTools.set(label, tool);

  return newTools;
}

/**
 * Deletes the tool and annotations for the specified label, updating tools
 * @param label Label to remove the tool for
 * @param tools Current state's tools prop
 * @param inPlace Whether tools' value should be modified directly or a shallow copy should be returned
 * @returns The updated tools Map
 */
function removeLabel(label: Label, tools: Map<Label, paper.Tool>, inPlace = false): Map<Label, paper.Tool> {
  const newTools = inPlace ? tools : new Map(tools);

  // Delete and remove tool - must do using setTimeout as remove dispatches actions
  const toolForLabel = newTools.get(label);
  if (toolForLabel) setTimeout(() => toolForLabel.remove());
  newTools.delete(label);

  // TODO: make sure project is loaded
  // Remove annotations with this label type
  if (paper.project?.layers[label.layer]) {
    [...paper.project.layers[label.layer].children].forEach((child: paper.PathItem) => {
      if (child.data.label === label.label) child.remove();
    });
  }

  return newTools;
}

export function getDefaultState(): Labels {
  const tools = new Map<Label, paper.Tool>();
  defaultLabels.forEach((label) => addToolForLabel(label, tools, true));

  return {
    labels: defaultLabels,
    tools,
    activeLabelType: LabelType.STRUCTURE,
  };
}

const labelTypeIndices: Record<AvailableLabelType, number> = {
  [LabelType.STRUCTURE]: 0,
  [LabelType.SURFACE]: 1,
  [LabelType.NONGEOLOGICAL]: 2,
};

function compareLabels(a: Label, b: Label) {
  // Compare label types
  const typeComparison = labelTypeIndices[a.layer] - labelTypeIndices[b.layer];
  if (typeComparison !== 0) return typeComparison;

  // Label types match, compare text alphabetically
  return a.labelText.localeCompare(b.labelText);
}

// Action handler
export default function labels(state = getDefaultState(), action: LabelsAction): Labels {
  switch (action.type) {
    case ADD_LABEL:
      //Ensure label has a non-blank name
      if (!action.label.label?.length) throw new Error('Please specify a name for the new label type.');
      // Ensure label doesn't already exist
      state.labels.forEach((label) => {
        if (label.label === action.label.label) throw new Error(`A label with the specified name (${action.label.labelText}) already exists. Please use a different name.`);
        if (label.color === action.label.color) throw new Error(`Label ${label.labelText} is using the same color as the label you just added, please make sure to use a different color for each label!`);
      });
      return {
        ...state,
        labels: [...state.labels, action.label].sort(compareLabels),
        tools: addToolForLabel(action.label, state.tools),
      };
    case REMOVE_LABEL:
      return {
        ...state,
        // No need to sort as no new labels are being inserted
        labels: state.labels.filter((label) => label !== action.label),
        tools: removeLabel(action.label, state.tools),
      };
    case SET_LABELS:
      state.labels.forEach((label) => removeLabel(label, state.tools, true));
      const newTools = new Map<Label, paper.Tool>();
      action.labels.forEach((label) => addToolForLabel(label, newTools, true));
      return {
        ...state,
        labels: [...action.labels].sort(compareLabels),
        tools: newTools,
      };
    case SET_ACTIVE_LABEL_TYPE:
      return {
        ...state,
        activeLabelType: action.labelType,
      }
    default:
      return state;
  }
}
