let TS_NODE;
if (typeof process !== 'undefined') {
  TS_NODE = process[Symbol.for("ts-node.register.instance")];
}
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from '@reach/router';
import { createStore } from 'redux';
import geoLabelerReducer from './redux/reducer';
import ContributePage from './components/ContributePage/ContributePage';
import LandingPage from './components/LandingPage/LandingPage';
import LabelingTool from './components/LabelingTool/LabelingTool';
import UserGuide from './components/UserGuide/UserGuide';

// Create redux store
const store = createStore(geoLabelerReducer);
export default store;

if (!TS_NODE) {
  ReactDom.render(
    <Provider store={store}>
      <Router>
        <LandingPage path="/" default />
        <ContributePage path="/contribute" />
        <LabelingTool path="/labelingtool" />
        <UserGuide path="/guide" />
      </Router>
    </Provider>,
    document.getElementById('root'),
  );
}
