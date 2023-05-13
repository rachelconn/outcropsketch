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
import { formatSubmissionAccuracy, StudentSubmission } from '../../../classes/API/APIClasses';

interface ComparisonToolProps extends RouteComponentProps {
  trueLabels: SerializedProject,
  annotation: SerializedProject,
  submission?: StudentSubmission;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ trueLabels, annotation, submission }) => {
  const trueLabelStore = React.useMemo(() => createStore(labelViewerReducer), []);
  const annotationStore = React.useMemo(() => createStore(labelViewerReducer), []);

  const studentAnnotationHeaderText = submission ? (
    `${submission.ownerFirstName}'s Annotations`
  ) : 'Student Annotation';

  const accuracyHeader = submission ? (
    <div className={styles.accuracyHeader}>
      <Typography variant="h4">
        {`Submission by ${submission.ownerFirstName} ${submission.ownerLastName} (Accuracy: ${formatSubmissionAccuracy(submission)})`}
      </Typography>
    </div>
  ) : undefined;

  // TODO: add "hover over them to see what they represent" to incorrect area
  return (
    <>
      {accuracyHeader}
      <div className={styles.comparisonToolContainer}>
        <Typography className={styles.header} variant="h5">Instructor Labels</Typography>
        <Typography className={styles.header} variant="h5">{studentAnnotationHeaderText}</Typography>
        <Typography className={styles.header} variant="h5">Incorrect Areas</Typography>

        <Typography className={styles.subheader} variant="body1">These are the correct annotations created by the instructor.</Typography>
        <Typography className={styles.subheader} variant="body1">These are the annotations created by the student.</Typography>
        <Typography className={styles.subheader} variant="body1">These are the areas that were labeled incorrectly by the student.</Typography>

        <Provider store={trueLabelStore}>
          <LabelViewer project={trueLabels} />
        </Provider>
        <Provider store={annotationStore}>
          <LabelViewer project={annotation} />
        </Provider>
        <Provider store={annotationStore}>
          <LabelComparisonViewer trueLabels={trueLabels} annotation={annotation} />
        </Provider>
      </div>
    </>
  );
};

export default ComparisonTool;
