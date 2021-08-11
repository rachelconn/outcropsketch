import { Cursor } from '../../classes/cursors/cursors';
import { ToolOption } from '../../classes/toolOptions/toolOptions';
import { OptionsAction, SET_CURSOR, SET_TOOL, SET_TOOL_OPTION_VALUE } from '../actions/options';

// Interface for the image state slice
export interface Options {
  cursor: Cursor,
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
