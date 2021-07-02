import { OptionsAction, SET_OVERWRITE } from '../actions/options';

// Interface for the image state slice
export interface Options {
  overwrite: boolean,
}

/**
 * State to use before any actions have been dispatched
 * @returns The default options state.
 */
function getDefaultState(): Options {
  return {
		overwrite: true,
  };
}

// Function to handle dispatched actions
export default function image(state = getDefaultState(), action: OptionsAction): Options {
  switch (action.type) {
		case SET_OVERWRITE:
			return {
				...state,
				overwrite: action.overwrite,
			};
		default:
			return state;
	}
}
