import * as React from 'react';
import { RouteComponentProps, useNavigate } from '@reach/router';
import Cookies from 'js-cookie';
import Article from '../common/Article';
import Form from '../common/Form';
import StandardPage from '../common/StandardPage/StandardPage';
import InputField from '../common/InputField/InputField';
import validateEmail from '../../utils/validateEmail';
import Checkbox from '../common/Checkbox/Checkbox';

const RegisterPage: React.FC<RouteComponentProps> = () => {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [student, setStudent] = React.useState(false);
  const [instructor, setInstructor] = React.useState(false);
  const [researcher, setResearcher] = React.useState(false);

  let errorText = '';
  if (!validateEmail(email)) errorText = 'Please ensure the email you entered is valid.';
  else if (password.length < 8) errorText = 'Your password must be at least 8 characters long.';
  else if (!firstName || !lastName) errorText = 'Please enter a first and last name.';
  else if (!student && !instructor && !researcher) errorText = 'You must select at least one role between student, instructor, and researcher.';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = JSON.stringify({
      email,
      password,
      // Must convert first/last name to snake case to match backend formatting
      'first_name': firstName,
      'last_name': lastName,
      student,
      instructor,
      researcher,
    });
    fetch('auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body,
    }).then((response) => {
      if (!response.ok) throw new Error(`An error occurred while trying to register: ${response}`)
      // TODO: save name to local storage to display later
      navigate('/');
    }).catch((e) => {
      // TODO: show modal with error message
      console.log(e);
    });
  };

  return (
    <StandardPage>
      <Article.Header>Register</Article.Header>
      <Form.Container errorText={errorText} onSubmit={handleSubmit}>
        <Form.Section>
          <InputField name="email" type="email" onChange={(value) => setEmail(value)}>Email</InputField>
          <InputField name="password" type="password" onChange={(value) => setPassword(value)}>Password</InputField>
          <InputField name="firstName" onChange={(value) => setFirstName(value)}>First Name</InputField>
          <InputField name="lastName" onChange={(value) => setLastName(value)}>Last Name</InputField>
        </Form.Section>
        <Form.Section>
          <Article.Subheader>I am:</Article.Subheader>
          <Checkbox name="student" onChange={(value) => setStudent(value)}>Student</Checkbox>
          <Checkbox name="instructor" onChange={(value) => setInstructor(value)}>Instructor</Checkbox>
          <Checkbox name="researcher" onChange={(value) => setResearcher(value)}>Researcher</Checkbox>
        </Form.Section>
      </Form.Container>
    </StandardPage>
  );
};

export default RegisterPage;
