import { Cursor } from '../../classes/cursors/cursors';
import { ToolOption } from '../../classes/toolOptions/toolOptions';
import { OptionsAction, SET_CURSOR, SET_TOOL_OPTIONS, SET_TOOL_OPTION_VALUE } from '../actions/options';

// Interface for the image state slice
export interface Options {
  cursor: Cursor,
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
    toolOptions: [],
    toolOptionValues: {
      [ToolOption.SNAP]: 15,
      [ToolOption.SNAP_SAME_LABEL]: false,
      [ToolOption.OVERWRITE]: true,
      [ToolOption.MERGE_SAME_LABEL]: true,
      [ToolOption.ERASER_TOLERANCE]: 0,
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
    case SET_TOOL_OPTIONS:
      return {
        ...state,
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
