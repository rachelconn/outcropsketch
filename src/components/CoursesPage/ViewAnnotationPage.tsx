import { RouteComponentProps, useParams } from '@reach/router';
import React from 'react';
import { StudentSubmission } from '../../classes/API/APIClasses';
import SerializedProject from '../../classes/serialization/project';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';
import StandardPage from '../common/StandardPage/StandardPage';
import ComparisonTool from '../LabelingTool/ComparisonTool/ComparisonTool';

interface ViewAnnotationPageProps extends RouteComponentProps<{
  location: {
    state: {
      submission: StudentSubmission;
    }
  }
}> {}

const ViewAnnotationPage: React.FC<ViewAnnotationPageProps> = ({ location }) => {
  const { annotationId, imageId } = useParams();
  const [labeledImage, setLabeledImage] = React.useState<SerializedProject>();
  const [annotation, setAnnotation] = React.useState<string>();
  const [errorResponse, setErrorResponse] = React.useState<Response>();
  const submission = location.state.submission;

  React.useEffect(() => {
    fetch(`/courses/get_image_data/${imageId}`)
      .then((response) => {
        if (response.ok) return response.text();
        setErrorResponse(response);
      })
      .then((jsonString) => {
        if (jsonString) setLabeledImage(JSON.parse(jsonString));
      })
      .catch((error) => {
        console.error(error);
      });

      fetch(`/courses/get_annotation/${annotationId}`, { redirect: 'follow' })
        .then((response) => {
          if (response.ok) return response.text();
          setErrorResponse(response);
        })
        .then((annotationResponse) => {
          if (annotationResponse) setAnnotation(annotationResponse);
        })
        .catch((error) => {
          console.error(error);
        })
  }, []);

  let pageContent: JSX.Element = undefined;
  if (labeledImage && annotation) {
    const annotationProject: SerializedProject = { ...labeledImage };
    annotationProject.project = annotation;
    pageContent = (
      <ComparisonTool trueLabels={labeledImage} annotation={annotationProject} submission={submission} />
    );
  }

  return (
    <StandardPage>
      {pageContent}
      <ErrorAlert response={errorResponse} />
    </StandardPage>
  );
};

export default ViewAnnotationPage;
