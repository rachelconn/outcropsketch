import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Article from '../common/Article';
import Form from '../common/Form';
import StandardPage from '../common/StandardPage/StandardPage';
import { useForm } from '@formspree/react';
import Button from '../common/Button/Button';
import InputField from '../common/InputField/InputField';
import Select from '../common/Select/Select';
import Typography from '../common/Typography/Typography';
import Checkbox from '../common/Checkbox/Checkbox';
import validateEmail from '../../utils/validateEmail';

const positions = [
  'Undergraduate Student',
  'Graduate Student',
  'Professional',
  'Researcher',
  'Other',
];

const ContributePage: React.FC<RouteComponentProps> = () => {
  const [formState, submitForm] = useForm('mgeqzyal');
  const [email, setEmail] = React.useState('');
  const submissionValid = validateEmail(email);
  const errorText = submissionValid ? '' : 'Please ensure the email you entered is valid.';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (submissionValid) submitForm(e);
  };

  const pageContent = formState.succeeded ? (
    <>
      <Article.Header>Thank you for contributing!</Article.Header>
      <Article.Paragraph>
        Your submission has been recorded.
        Thank you for choosing to help Outcrop Sketch!
        Feel free to submit more feedback or update your email preferences at any time.
        If you had a comment for us that requires feedback, we will follow up with you shortly.
      </Article.Paragraph>
    </>
  ) : (
    <>
      <Article.Header>Get Involved</Article.Header>
      <Article.Paragraph>
        You can use the form below to send us feedback,
        or to be added to one of our mailing lists when we're ready to accept contributions.
        Alternatively, you can email us at&nbsp;
        <a href="mailto:outcropsketch@gmail.com">
          outcropsketch@gmail.com
        </a> with any questions or concerns you may have.
        Thank you for your interest in helping Outcrop Sketch!
      </Article.Paragraph>
      <Form.Container errorText={errorText} onSubmit={(e) => handleSubmit(e)}>
        <Form.Section>
          <InputField name="name">
            Name
          </InputField>
          <InputField name="email" type="email" onChange={(value) => setEmail(value)}>
            Email (*)
          </InputField>
          <Select name="position" options={positions}>
            Position
          </Select>
          <InputField name="notes"  type="textarea">
            Notes, comments, or questions
          </InputField>
        </Form.Section>
        <Article.Subheader>I want to receive emails about the following:</Article.Subheader>
        <Form.Section>
          <Checkbox name="generalUpdates">General updates to Outcrop Sketch</Checkbox>
          <Checkbox name="outcropPhotoSubmission">Photo submission opportunities</Checkbox>
          <Checkbox name="outcropPhotoLabeling">Photo labeling opportunities</Checkbox>
          <Checkbox name="stratificationLabPilot">Opportunities for piloting a sedimentary stratification lab</Checkbox>
        </Form.Section>
      </Form.Container>
    </>
  );

  return (
    <StandardPage>
      {pageContent}
    </StandardPage>
  );
};

export default ContributePage;
