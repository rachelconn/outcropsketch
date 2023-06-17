import paper from 'paper-jsdom-canvas';
import { Label, LabelType } from "../../classes/labeling/labeling";
import { StructureType, getStructureTypeColor, getStructureTypeName } from '../../classes/labeling/structureType';
import { SurfaceType, getSurfaceTypeColor, getSurfaceTypeName } from '../../classes/labeling/surfaceType';
import { NonGeologicalType, getNonGeologicalTypeColor, getNonGeologicalTypeName } from '../../classes/labeling/nonGeologicalType';
import { ADD_LABEL, LabelsAction, REMOVE_LABEL, SET_ACTIVE_LABEL_TYPE, SET_LABELS } from '../actions/labels';
import createFillLassoTool from '../../tools/fillLasso';
import createPencilTool from '../../tools/pencil';

export interface Labels {
  activeLabelType: LabelType,
  labels: Label[],
  tools: Map<Label, paper.Tool>,
}

const defaultLabels: Label[] = [
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

  const fillColor = new paper.Color(label.color);
  fillColor.alpha /= 2;
  const tool = label.layer === LabelType.SURFACE ? createPencilTool({
    layer: LabelType.SURFACE,
    canContinue: true,
    strokeColor: label.color,
    label: label.labelType,
    labelText: label.labelText,
  }) : createFillLassoTool({
    layer: label.layer,
    strokeColor: label.color,
    fillColor,
    label: label.labelType,
    labelText: label.labelText,
  });
  newTools.set(label, tool);

  return newTools;
}

/**
 * Deletes the tool for the specified label and updates tools
 * @param label Label to remove the tool for
 * @param tools Current state's tools prop
 * @param inPlace Whether tools' value should be modified directly or a shallow copy should be returned
 * @returns The updated tools Map
 */
function removeToolForLabel(label: Label, tools: Map<Label, paper.Tool>, inPlace = false): Map<Label, paper.Tool> {
  const newTools = inPlace ? tools : new Map(tools);

  newTools.get(label).remove();
  newTools.delete(label);

  return newTools;
}

function getDefaultState(): Labels {
  const tools = new Map<Label, paper.Tool>();
  defaultLabels.forEach((label) => addToolForLabel(label, tools, true));

  return {
    labels: defaultLabels,
    tools,
    activeLabelType: LabelType.STRUCTURE,
  };
}

// Action handler
export default function labels(state = getDefaultState(), action: LabelsAction): Labels {
  switch (action.type) {
    case ADD_LABEL:
      return {
        ...state,
        labels: [...state.labels, action.label],
        tools: addToolForLabel(action.label, state.tools),
      };
    case REMOVE_LABEL:
      // TODO: need to remove all instances of the label from canvas
      return {
        ...state,
        labels: state.labels.filter((label) => label !== action.label),
        tools: removeToolForLabel(action.label, state.tools),
      };
    case SET_LABELS:
      state.labels.forEach((label) => removeToolForLabel(label, state.tools, true));
      const newTools = new Map(state.tools);
      return {
        ...state,
        labels: action.labels,
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
