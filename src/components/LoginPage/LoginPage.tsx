import * as React from 'react';
import { RouteComponentProps, useNavigate } from '@reach/router';
import Cookies from 'js-cookie';
import Article from '../common/Article';
import Form from '../common/Form';
import StandardPage from '../common/StandardPage/StandardPage';
import InputField from '../common/InputField/InputField';
import validateEmail from '../../utils/validateEmail';

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement,
  password: HTMLInputElement,
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements,
}

const LoginPage: React.FC<RouteComponentProps> = () => {
  const navigate = useNavigate();

  // TODO: remove validation here, use it for register instead
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  let errorText = '';
  if (!validateEmail(email)) errorText = 'Please ensure the email you entered is valid.';
  else if (password.length < 8) errorText = 'Your password must be at least 8 characters long.';

  const handleSubmit = (e: React.FormEvent<LoginFormElement>) => {
    e.preventDefault();
    const body = JSON.stringify({
      email: e.currentTarget.elements.email.value,
      password: e.currentTarget.elements.password.value,
    });

    fetch('auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body,
    }).then((response) => {
      if (!response.ok) throw new Error(`An error occurred while logging in: ${response}`)
      // TODO: save name to local storage to display later
      navigate('/');
    }).catch((e) => {
      // TODO: show modal with erorr message
      console.log(e);
    });
  };

  return (
    <StandardPage>
      <Article.Header>Sign In</Article.Header>
      <Form.Container errorText={errorText} onSubmit={handleSubmit}>
        <Form.Section>
          <InputField name="email" type="email" onChange={(value) => setEmail(value)}>
            Email
          </InputField>
          <InputField name="password" type="password" onChange={(value) => setPassword(value)}>
            Password
          </InputField>
        </Form.Section>
      </Form.Container>
    </StandardPage>
  );
};

export default LoginPage;
