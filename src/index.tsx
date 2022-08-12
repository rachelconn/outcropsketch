let TS_NODE;
if (typeof process !== 'undefined') {
  TS_NODE = process[Symbol.for("ts-node.register.instance")];
}
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import geoLabelerReducer from './redux/reducer';

// Create redux store
const store = createStore(geoLabelerReducer);
export default store;

if (!TS_NODE) {
  const App = require('./components/App/App');
  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  );
}
