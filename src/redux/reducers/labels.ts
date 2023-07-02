import paper from 'paper-jsdom-canvas';
import { Label, LabelType } from "../../classes/labeling/labeling";
import { StructureType, getStructureTypeColor, getStructureTypeName } from '../../classes/labeling/structureType';
import { SurfaceType, getSurfaceTypeColor, getSurfaceTypeName } from '../../classes/labeling/surfaceType';
import { NonGeologicalType, getNonGeologicalTypeColor, getNonGeologicalTypeName } from '../../classes/labeling/nonGeologicalType';
import { ADD_LABEL, AvailableLabelType, LabelsAction, REMOVE_LABEL, SET_ACTIVE_LABEL_TYPE, SET_LABELS } from '../actions/labels';
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
    labelType: StructureType.STRUCTURELESS,
    labelText: getStructureTypeName(StructureType.STRUCTURELESS),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.PLANAR_BEDDED),
    labelType: StructureType.PLANAR_BEDDED,
    labelText: getStructureTypeName(StructureType.PLANAR_BEDDED),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.CROSS_BEDDED),
    labelType: StructureType.CROSS_BEDDED,
    labelText: getStructureTypeName(StructureType.CROSS_BEDDED),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.GRADED),
    labelType: StructureType.GRADED,
    labelText: getStructureTypeName(StructureType.GRADED),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.CONTORTED),
    labelType: StructureType.CONTORTED,
    labelText: getStructureTypeName(StructureType.CONTORTED),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.UNKNOWN),
    labelType: StructureType.UNKNOWN,
    labelText: getStructureTypeName(StructureType.UNKNOWN),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.COVERED),
    labelType: StructureType.COVERED,
    labelText: getStructureTypeName(StructureType.COVERED),
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.EROSION),
    labelType: SurfaceType.EROSION,
    labelText: getSurfaceTypeName(SurfaceType.EROSION),
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.FRACTURE),
    labelType: SurfaceType.FRACTURE,
    labelText: getSurfaceTypeName(SurfaceType.FRACTURE),
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.FAULT),
    labelType: SurfaceType.FAULT,
    labelText: getSurfaceTypeName(SurfaceType.FAULT),
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.PALEOSOL),
    labelType: SurfaceType.PALEOSOL,
    labelText: getSurfaceTypeName(SurfaceType.PALEOSOL),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.PERSON),
    labelType: NonGeologicalType.PERSON,
    labelText: getNonGeologicalTypeName(NonGeologicalType.PERSON),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.COMPASS),
    labelType: NonGeologicalType.COMPASS,
    labelText: getNonGeologicalTypeName(NonGeologicalType.COMPASS),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.HAMMER),
    labelType: NonGeologicalType.HAMMER,
    labelText: getNonGeologicalTypeName(NonGeologicalType.HAMMER),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.PENCIL),
    labelType: NonGeologicalType.PENCIL,
    labelText: getNonGeologicalTypeName(NonGeologicalType.PENCIL),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.SKY),
    labelType: NonGeologicalType.SKY,
    labelText: getNonGeologicalTypeName(NonGeologicalType.SKY),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.FOLIAGE),
    labelType: NonGeologicalType.FOLIAGE,
    labelText: getNonGeologicalTypeName(NonGeologicalType.FOLIAGE),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.MISC),
    labelType: NonGeologicalType.MISC,
    labelText: getNonGeologicalTypeName(NonGeologicalType.MISC),
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
    layer: LabelType.SURFACE,
    canContinue: true,
    strokeColor,
    label: label.labelType,
    labelText: label.labelText,
  }) : createFillLassoTool({
    layer: label.layer,
    strokeColor,
    fillColor,
    label: label.labelType,
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
      if (!action.label.labelType?.length) throw new Error('Please specify a name for the new label type.');
      // Ensure label doesn't already exist
      if (state.labels.some((label) => label.labelType === action.label.labelType)) {
        throw new Error(`A label with the specified name (${action.label.labelText}) already exists. Please use a different name.`);
      }
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
