import paper from 'paper-jsdom-canvas';
import { Cursor } from '../../classes/cursors/cursors';
import { LabelType } from '../../classes/labeling/labeling';
import Layer, { NonLabelType } from '../../classes/layers/layers';
import { ToolOption } from '../../classes/toolOptions/toolOptions';
import { OptionsAction, SET_CURSOR, SET_ENABLE_HOTKEYS, SET_LAYER, SET_TOOL, SET_TOOL_OPTION_VALUE, SET_UNLABELED_AREA_OPACITY } from '../actions/options';
import { waitForProjectLoad } from './undoHistory';

// Interface for the image state slice
export interface Options {
  cursor: Cursor,
  layer: Layer,
  tool: paper.Tool,
  toolOptions: ToolOption[],
  toolOptionValues: Record<ToolOption, any>,
  unlabeledAreaOpacity: number,
  enableHotkeys: boolean,
}

/**
 * State to use before any actions have been dispatched
 * @returns The default options state.
 */
function getDefaultState(): Options {
  return {
    cursor: Cursor.AREA_LASSO,
    layer: LabelType.STRUCTURE,
    tool: undefined,
    toolOptions: [],
    toolOptionValues: {
      [ToolOption.SNAP]: 15,
      [ToolOption.SNAP_SAME_LABEL]: false,
      [ToolOption.OVERWRITE]: true,
      [ToolOption.MERGE]: true,
      [ToolOption.ERASER_TOLERANCE]: 0,
      [ToolOption.CONTINUE_SURFACES]: 15,
      [ToolOption.CLICK_PER_POINT]: false,
    },
    unlabeledAreaOpacity: 0,
    enableHotkeys: true,
  };
}

// Function to handle dispatched actions
export default function image(state = getDefaultState(), action: OptionsAction): Options {
  switch (action.type) {
    case SET_CURSOR:
      return {
        ...state,
        cursor: action.cursor,
      };
    case SET_ENABLE_HOTKEYS:
      return {
        ...state,
        enableHotkeys: action.enabled,
      };
    case SET_LAYER:
      // Activate the new paper layer
      waitForProjectLoad().then(() => {
        paper.project.layers[action.layer].activate();
      });

      return {
        ...state,
        layer: action.layer,
      };
    case SET_TOOL:
      return {
        ...state,
        tool: action.tool,
        toolOptions: action.toolOptions,
      };
    case SET_TOOL_OPTION_VALUE:
      return {
        ...state,
        toolOptionValues: {
          ...state.toolOptionValues,
          [action.toolOption]: action.value,
        }
      };
    case SET_UNLABELED_AREA_OPACITY:
      waitForProjectLoad().then(() => {
        paper.project.layers[NonLabelType.UNLABELED_AREA].opacity = action.opacity;
      });
      return {
        ...state,
        unlabeledAreaOpacity: action.opacity,
      };
		default:
			return state;
	}
}
