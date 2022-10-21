import { createStore } from 'redux';
import geoLabelerReducer from './reducer';

// Create redux store
const store = createStore(geoLabelerReducer);
export default store;
