import { Provider } from 'react-redux';
import React from 'react';
import { RouteComponentProps } from '@reach/router';
import styles from './ComparisonTool.css';
import SerializedProject from '../../../classes/serialization/project';
import LabelViewer from '../LabelViewer/LabelViewer';
import { createStore } from 'redux';
import { labelViewerReducer } from '../../../redux/reducer';
import Typography from '../../common/Typography/Typography';
import LabelComparisonViewer from '../LabelViewer/LabelComparisonViewer';

interface ComparisonToolProps extends RouteComponentProps {
  trueLabels: SerializedProject,
  annotation: SerializedProject,
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ trueLabels, annotation }) => {
  const trueLabelStore = React.useMemo(() => createStore(labelViewerReducer), []);
  const annotationStore = React.useMemo(() => createStore(labelViewerReducer), []);

  return (
    <div className={styles.comparisonToolContainer}>
      <div className={styles.labelViewerContainer}>
        <Typography variant="h5">Instructor Labels</Typography>
        <Provider store={trueLabelStore}>
          <LabelViewer project={trueLabels} />
        </Provider>
      </div>
      <div className={styles.labelViewerContainer}>
        <Typography variant="h5">Student Annotation</Typography>
        <Provider store={annotationStore}>
          <LabelViewer project={annotation} />
        </Provider>
      </div>
      <div className={styles.labelViewerContainer}>
        <Typography variant="h5">Difference</Typography>
        <Provider store={annotationStore}>
          <LabelComparisonViewer trueLabels={trueLabels} annotation={annotation} />
        </Provider>
      </div>
    </div>
  );
};

export default ComparisonTool;