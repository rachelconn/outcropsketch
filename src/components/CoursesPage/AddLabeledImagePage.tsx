import * as React from 'react';
import Cookies from 'js-cookie';
import { RouteComponentProps, useNavigate, useParams } from '@reach/router';
import Article from '../common/Article';
import styles from'./styles.css';
import InputField from '../common/InputField/InputField';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';
import Form from '../common/Form';
import FileSelect from '../common/FileSelect/FileSelect';

const AddLabeledImagePage: React.FC<RouteComponentProps> = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [errorResponse, setErrorResponse] = React.useState<Response>();
  const [title, setTitle] = React.useState('');
  const [labelFile, setLabelFile] = React.useState<File>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = new FormData();
    body.append('image', labelFile);

    // TODO: complete this
    fetch(`/courses/add_image/${params.courseId}`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body,
    })
      .then((response) => {
        // TODO: redirect
        if (response.ok) navigate(`/mycourses/${params.courseId}/manage`);
        setErrorResponse(response);
      });
  };

  return (
    <>
      <Article.Header>Add Labeled Image to Class</Article.Header>
      <Form.Container onSubmit={handleSubmit}>
        <Form.Section>
          <div className={styles.fileSelectContainer}>
            <FileSelect type="json" onChange={(file) => setLabelFile(file)}>Label File</FileSelect>
          </div>
          <InputField name="title" onChange={(value) => setTitle(value)}>Title</InputField>
        </Form.Section>
      </Form.Container>
      <ErrorAlert response={errorResponse} />
    </>
  );
};

export default AddLabeledImagePage;
