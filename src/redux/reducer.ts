import { combineReducers } from 'redux';
import image from './reducers/image';

// Combines state slices for overall app state
const geoLabelerReducer = combineReducers({
  image,
});

export default geoLabelerReducer;
export type RootState = ReturnType<typeof geoLabelerReducer>;
