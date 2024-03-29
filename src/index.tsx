let TS_NODE;
if (typeof process !== 'undefined') {
  TS_NODE = process[Symbol.for("ts-node.register.instance")];
}
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from '@reach/router';
import store from './redux/store';
import ContributePage from './components/ContributePage/ContributePage';
import LandingPage from './components/LandingPage/LandingPage';
import CoursesPage from './components/CoursesPage/CoursesPage';
import LabelingTool from './components/LabelingTool/LabelingTool';
import UserGuide from './components/UserGuide/UserGuide';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import PageNotFound from './components/PageNotFound/PageNotFound';
import MyCoursesPage from './components/CoursesPage/MyCoursesPage';
import CreateCoursePage from './components/CoursesPage/CreateCoursePage';
import ManageCoursePage from './components/CoursesPage/ManageCoursePage';
import AddLabeledImagePage from './components/CoursesPage/AddLabeledImagePage';
import ViewSubmissionsPage from './components/CoursesPage/ViewSubmissionsPage';
import ViewAnnotationPage from './components/CoursesPage/ViewAnnotationPage';

if (!TS_NODE) {
  ReactDom.render(
    <Provider store={store}>
      <Router>
        <LandingPage path="/" />
        <ContributePage path="contribute" />
        <CoursesPage path="mycourses">
          <MyCoursesPage path="/" />
          <CreateCoursePage path="create" />
          <ManageCoursePage path=":courseId/manage" />
          <AddLabeledImagePage path=":courseId/upload" />
          <ViewSubmissionsPage path="images/:imageId/submissions" />
          <ViewAnnotationPage path="images/:imageId/view_annotation/:annotationId" />
          <LabelingTool path="images/:imageId/annotate" />
          <PageNotFound default />
        </CoursesPage>
        <LabelingTool path="labelingtool" />
        <UserGuide path="guide" />
        <LoginPage path="login" />
        <RegisterPage path="register" />
        <PageNotFound default />
      </Router>
    </Provider>,
    document.getElementById('root'),
  );
}
