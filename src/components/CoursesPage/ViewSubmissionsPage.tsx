import { RouteComponentProps, useParams } from '@reach/router';
import React from 'react';
import { LabeledImageProps, ListSubmissionsAPIReturnType } from '../../classes/API/APIClasses';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';
import StandardPage from '../common/StandardPage/StandardPage';
import viewIcon from '../../icons/visibility.svg';
import parseDjangoTime from '../../utils/parseDjangoTime';
import styles from './styles.css';
import Article from '../common/Article/index';

interface ViewSubmissionsPageProps extends RouteComponentProps<{
  location: {
    state: {
      labeledImage: LabeledImageProps;
    }
  }
}> {}

const ViewSubmissionsPage: React.FC<ViewSubmissionsPageProps> = ({ location }) => {
  const params = useParams();
  const [submissions, setSubmissions] = React.useState<ListSubmissionsAPIReturnType>();
  const [errorResponse, setErrorResponse] = React.useState<Response>();

  React.useEffect(() => {
    fetch(`/courses/list_annotations/${params.imageId}`)
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
      return (
        <tr className={styles.submissionsTableRow} key={submission.id}>
          <th className={styles.submissionsCell}>{`${submission.ownerFirstName} ${submission.ownerLastName}`}</th>
          <th className={styles.submissionsCell}>{parseDjangoTime(submission.createdAt).toLocaleString()}</th>
          <th className={styles.submissionsCell}>
            <img className={styles.submissionsTableIcon} width={24} height={24} src={viewIcon} />
          </th>
        </tr>
      );
    });

    pageContent = (
      <>
        <Article.Header>{`Submissions for ${location.state.labeledImage.name}`}</Article.Header>
        <div className={styles.submissionsTableContainer}>
          <table className={styles.submissionsTable}>
            <tbody className={styles.submissionsTableBody}>
              <tr className={styles.submissionsTableRow}>
                <th className={styles.submissionsCell}>Name</th>
                <th className={styles.submissionsCell}>Submitted</th>
                <th className={styles.submissionsCell}>View</th>
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
