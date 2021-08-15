import paper from 'paper';
import { Cursor } from '../../classes/cursors/cursors';
import { LabelType } from '../../classes/labeling/labeling';
import Layer from '../../classes/layers/layers';
import { ToolOption } from '../../classes/toolOptions/toolOptions';
import { waitForProjectLoad } from '../../utils/paperLayers';
import { OptionsAction, SET_CURSOR, SET_LAYER, SET_TOOL, SET_TOOL_OPTION_VALUE } from '../actions/options';

// Interface for the image state slice
export interface Options {
  cursor: Cursor,
  layer: Layer,
  tool: paper.Tool,
  toolOptions: ToolOption[],
  toolOptionValues: Record<ToolOption, any>,
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
      [ToolOption.MERGE_SAME_LABEL]: true,
      [ToolOption.ERASER_TOLERANCE]: 0,
      [ToolOption.CONTINUE_SURFACES]: 15,
    },
  };
}

// Function to handle dispatched actions
export default function image(state = getDefaultState(), action: OptionsAction): Options {
  switch (action.type) {
    case SET_CURSOR:
      return {
        ...state,
        cursor: action.cursor,
      }
    case SET_LAYER:
      // Activate the new paper layer
      waitForProjectLoad().then(() => {
        paper.project.layers[action.layer].activate();
      });

      return {
        ...state,
        layer: action.layer,
      }
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
      }
		default:
			return state;
	}
}
