import * as React from 'react';
import { RouteComponentProps, useNavigate } from '@reach/router';
import Cookies from 'js-cookie';
import Article from '../common/Article';
import Form from '../common/Form';
import StandardPage from '../common/StandardPage/StandardPage';
import InputField from '../common/InputField/InputField';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement,
  password: HTMLInputElement,
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements,
}

const LoginPage: React.FC<RouteComponentProps> = () => {
  const navigate = useNavigate();
  const [errorResponse, setErrorResponse] = React.useState<Response>();

  const handleSubmit = (e: React.FormEvent<LoginFormElement>) => {
    e.preventDefault();

    const body = JSON.stringify({
      email: e.currentTarget.elements.email.value,
      password: e.currentTarget.elements.password.value,
    });
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body,
    }).then((response) => {
      if (response.ok) navigate('/');
      else setErrorResponse(response);
      // TODO: save name to local storage to display later
    }).catch((e) => {
      console.error(`An error occurred while logging in: ${e}`)
    });
  };

  return (
    <StandardPage>
      <Article.Header>Sign In</Article.Header>
      <Form.Container errorText="" onSubmit={handleSubmit}>
        <Form.Section>
          <InputField name="email" type="email">Email</InputField>
          <InputField name="password" type="password">Password</InputField>
        </Form.Section>
      </Form.Container>
      <ErrorAlert response={errorResponse} />
    </StandardPage>
  );
};

export default LoginPage;
