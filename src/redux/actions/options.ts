// Action types
export const SET_OVERWRITE = 'SET_OVERWRITE';

// Action interfaces
export interface SetOverwriteAction {
  type: 'SET_OVERWRITE',
  overwrite: boolean,
}

// Action creators
export function setOverwrite(overwrite: boolean): SetOverwriteAction {
  return {
    type: SET_OVERWRITE,
		overwrite,
  };
}

export type OptionsAction = (
	SetOverwriteAction
);
