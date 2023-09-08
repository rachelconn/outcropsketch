import { combineReducers } from 'redux';
import image from './reducers/image';
import options from './reducers/options';
import undoHistory from './reducers/undoHistory';

// Combines state slices for overall app state
const geoLabelerReducer = combineReducers({
  image,
	options,
	undoHistory,
});

export const labelViewerReducer = combineReducers({
  image,
});

export default geoLabelerReducer;
export type RootState = ReturnType<typeof geoLabelerReducer>;
