import { RouteComponentProps, useParams } from '@reach/router';
import React from 'react';
import SerializedProject from '../../classes/serialization/project';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';
import StandardPage from '../common/StandardPage/StandardPage';
import ComparisonTool from '../LabelingTool/ComparisonTool/ComparisonTool';

const ViewAnnotationPage: React.FC<RouteComponentProps> = () => {
  const { annotationId, imageId } = useParams();
  const [labeledImage, setLabeledImage] = React.useState<SerializedProject>();
  const [annotation, setAnnotation] = React.useState<string>();
  const [errorResponse, setErrorResponse] = React.useState<Response>();

  React.useEffect(() => {
    fetch(`/courses/get_image_data/${imageId}`)
      .then((response) => {
        if (response.ok) return response.text();
        throw new Error('Error loading from provided URL. Please try again later.');
      })
      .then((jsonString) => {
        setLabeledImage(JSON.parse(jsonString));
      })
      .catch((error) => {
        // TODO: use ErrorAlert
        console.error(error);
      });

      fetch(`/courses/get_annotation/${annotationId}`, { redirect: 'follow' })
        .then((response) => {
          if (response.ok) return response.text();
          throw new Error('Error loading from provided URL. Please try again later.');
        })
        .then((annotation) => setAnnotation(annotation))
        .catch((error) => {
          console.error(error);
        })
  }, []);

  let pageContent: JSX.Element = undefined;
  if (labeledImage && annotation) {
    const annotationProject: SerializedProject = { ...labeledImage };
    annotationProject.project = annotation;
    pageContent = (
      <ComparisonTool trueLabels={labeledImage} annotation={annotationProject} />
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
