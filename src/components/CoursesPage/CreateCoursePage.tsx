import * as React from 'react';
import { RouteComponentProps, useNavigate } from '@reach/router';
import Cookies from 'js-cookie';
import Article from '../common/Article';
import Form from '../common/Form';
import InputField from '../common/InputField/InputField';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';

// TODO: add back button

const CreateCoursePage: React.FC<RouteComponentProps> = ({ navigate }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [errorResponse, setErrorResponse] = React.useState<Response>();

  const errorText = title.length ? '' : 'Please enter a title.';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = JSON.stringify({
      title,
      description,
    });
    fetch('/courses/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body,
    }).then((response) => {
      if (response.ok) navigate('../');
      else setErrorResponse(response);
    }).catch((e) => {
      console.error(`An error occurred while logging in: ${e}`)
    });
  };

  return (
    <Form.Container errorText={errorText} onSubmit={handleSubmit}>
      <Article.Header>Create Course</Article.Header>
      <Form.Section>
        <InputField name="title" onChange={(value) => setTitle(value)}>Title</InputField>
        <InputField name="description" onChange={(value) => setDescription(value)}>Description</InputField>
      </Form.Section>
      <ErrorAlert response={errorResponse} />
    </Form.Container>
  );
};

export default CreateCoursePage;
