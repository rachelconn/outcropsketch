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

// TODO: make sure clean initial render is performed when navigating away from labeling tool and then initializing it again
const ComparisonTool: React.FC<ComparisonToolProps> = ({ trueLabels, annotation }) => {
  const trueLabelStore = React.useMemo(() => createStore(labelViewerReducer), []);
  const annotationStore = React.useMemo(() => createStore(labelViewerReducer), []);

  // TODO: need to call createStore?
  return (
    <div className={styles.comparisonToolContainer}>
      <div className={styles.labelViewerContainer}>
        <Provider store={trueLabelStore}>
          <LabelViewer project={trueLabels} />
        </Provider>
        <Typography variant="h5">Instructor Labels</Typography>
      </div>
      <div className={styles.labelViewerContainer}>
        <Provider store={annotationStore}>
          <LabelViewer project={annotation} />
        </Provider>
        <Typography variant="h5">Student Annotation</Typography>
      </div>
      <div className={styles.labelViewerContainer}>
        <Provider store={annotationStore}>
          <LabelComparisonViewer trueLabels={trueLabels} annotation={annotation} />
        </Provider>
        <Typography variant="h5">Difference</Typography>
      </div>
      {/* <LabelViewer id="diff-labels" project={} /> */}
    </div>
  );
};

export default ComparisonTool;
