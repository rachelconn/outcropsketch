let TS_NODE;
if (typeof process !== 'undefined') {
  TS_NODE = process[Symbol.for("ts-node.register.instance")];
}
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from '@reach/router';
import ContributePage from './components/ContributePage/ContributePage';
import LandingPage from './components/LandingPage/LandingPage';
import LabelingTool from './components/LabelingTool/LabelingTool';
import UserGuide from './components/UserGuide/UserGuide';
import store from './redux/store';

if (!TS_NODE) {
  ReactDom.render(
    <Provider store={store}>
      <Router>
        <LandingPage path="/a" />
        <ContributePage path="/contribute" />
        <LabelingTool path="/labelingtool" default/>
        <UserGuide path="/guide" />
      </Router>
    </Provider>,
    document.getElementById('root'),
  );
}
