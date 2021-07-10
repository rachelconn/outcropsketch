import { ToolOption } from '../../classes/toolOptions/toolOptions';
import { OptionsAction, SET_TOOL_OPTIONS, SET_TOOL_OPTION_VALUE } from '../actions/options';

// Interface for the image state slice
export interface Options {
  toolOptions: ToolOption[],
  toolOptionValues: Record<ToolOption, any>,
}

/**
 * State to use before any actions have been dispatched
 * @returns The default options state.
 */
function getDefaultState(): Options {
  return {
    toolOptions: [],
    toolOptionValues: {
      [ToolOption.SNAP]: 15,
      [ToolOption.SNAP_SAME_LABEL]: false,
      [ToolOption.OVERWRITE]: true,
      [ToolOption.MERGE_SAME_LABEL]: true,
    },
  };
}

// Function to handle dispatched actions
export default function image(state = getDefaultState(), action: OptionsAction): Options {
  switch (action.type) {
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
