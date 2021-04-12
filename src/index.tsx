import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './components/App/App';
import SketchCanvas from './components/SketchCanvas/SketchCanvas';
import geoLabelerReducer from './redux/reducer';

// Create redux store
const store = createStore(geoLabelerReducer);
export default store;

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
