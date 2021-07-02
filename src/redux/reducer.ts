import { combineReducers } from 'redux';
import image from './reducers/image';
import undoHistory from './reducers/undoHistory';

// Combines state slices for overall app state
const geoLabelerReducer = combineReducers({
  image,
	undoHistory,
});

export default geoLabelerReducer;
export type RootState = ReturnType<typeof geoLabelerReducer>;
