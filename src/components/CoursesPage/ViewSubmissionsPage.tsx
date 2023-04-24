import { RouteComponentProps, useNavigate, useParams } from '@reach/router';
import React from 'react';
import { LabeledImageProps, ListSubmissionsAPIReturnType } from '../../classes/API/APIClasses';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';
import StandardPage from '../common/StandardPage/StandardPage';
import viewIcon from '../../icons/visibility.svg';
import parseDjangoTime from '../../utils/parseDjangoTime';
import styles from './styles.css';
import Article from '../common/Article/index';
import Typography from '../common/Typography/Typography';

interface ViewSubmissionsPageProps extends RouteComponentProps<{
  location: {
    state: {
      labeledImage: LabeledImageProps;
    }
  }
}> {}

const ViewSubmissionsPage: React.FC<ViewSubmissionsPageProps> = ({ location }) => {
  const navigate = useNavigate();
  const { imageId } = useParams();
  const [submissions, setSubmissions] = React.useState<ListSubmissionsAPIReturnType>();
  const [errorResponse, setErrorResponse] = React.useState<Response>();

  React.useEffect(() => {
    fetch(`/courses/list_annotations/${imageId}`)
      .then((response) => {
        if (response.ok) return response.json();
        setErrorResponse(response);
        return [];
      })
      .then((responseSubmissions) => setSubmissions(responseSubmissions));
  }, []);

  let pageContent: JSX.Element = undefined;
  if (submissions) {
    const submissionTableItems = submissions.map((submission) => {
      const handleViewClick = () => {
        navigate(`/mycourses/images/${imageId}/view_annotation/${submission.id}`)
      };

      const accuracyToDisplay = submission.accuracy
        ? `${submission.accuracy.toFixed(1)}%`
        : '—';

      return (
        <tr className={styles.submissionsTableRow} key={submission.id}>
          <th className={styles.submissionsCell}>
            <Typography variant="body1">
              {`${submission.ownerFirstName} ${submission.ownerLastName}`}
            </Typography>
          </th>
          <th className={styles.submissionsCell}>
            <Typography variant="body1">
              {parseDjangoTime(submission.createdAt).toLocaleString()}
            </Typography>
          </th>
          <th className={styles.submissionsCell}>
            <Typography variant="body1">
              {accuracyToDisplay}
            </Typography>
          </th>
          <th className={styles.submissionsCell}>
            <img className={styles.submissionsTableIcon} width={24} height={24} src={viewIcon} onClick={handleViewClick} />
          </th>
        </tr>
      );
    });

    // TODO: inform user there are no submissions instead of rendering an empty table
    pageContent = (
      <>
        <Article.Header>{`Submissions for ${location.state.labeledImage.name}`}</Article.Header>
        <div className={styles.submissionsTableContainer}>
          <table className={styles.submissionsTable}>
            <tbody className={styles.submissionsTableBody}>
              <tr className={styles.submissionsTableRow}>
                <th className={styles.submissionsCell}>
                  <Typography variant="body1">
                    Name
                  </Typography>
                </th>
                <th className={styles.submissionsCell}>
                  <Typography variant="body1">
                    Submitted
                  </Typography>
                </th>
                <th className={styles.submissionsCell}>
                  <Typography variant="body1">
                    Accuracy
                  </Typography>
                </th>
                <th className={styles.submissionsCell}>
                  <Typography variant="body1">
                    View
                  </Typography>
                </th>
              </tr>
              {submissionTableItems}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <StandardPage>
      {pageContent}
      <ErrorAlert response={errorResponse} />
    </StandardPage>
  );
};

export default ViewSubmissionsPage;
