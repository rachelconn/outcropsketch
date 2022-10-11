import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Article from '../common/Article';
import StandardPage from '../common/StandardPage/StandardPage';
import { useForm } from '@formspree/react';
import Button from '../common/Button/Button';
import InputField from '../common/InputField/InputField';
import styles from './ContributePage.css';
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

interface FormData {
  name?: string,
  email?: string,
  position?: string,
  generalUpdates?: boolean,
  outcropPhotoSubmission?: boolean,
  outcropPhotoLabeling?: boolean,
  stratificationLabPilot?: boolean,
  notes?: string,
};

const ContributePage: React.FC<RouteComponentProps> = () => {
  const [formState, submitForm] = useForm('mgeqzyal');
  const [formData, setFormData] = React.useState<FormData>({});

  const setFormString = (key: 'name' | 'email' | 'position' | 'notes', value: string) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const setFormBoolean = (key: 'generalUpdates' | 'outcropPhotoSubmission' | 'outcropPhotoLabeling' | 'stratificationLabPilot', value: boolean) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const submissionValid = validateEmail(formData.email);

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
      <form className={styles.formContainer} onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.formSectionContainer}>
          <InputField name="name" onChange={(value) => setFormString('name', value)}>
            Name
          </InputField>
          <InputField name="email" type="email" onChange={(value) => setFormString('email', value)}>
            Email (*)
          </InputField>
          <Select name="position" options={positions} onChange={(value => setFormString('position', value))}>
            Position
          </Select>
          <InputField name="notes"  type="textarea" onChange={(value) => setFormString('notes', value)}>
            Notes, comments, or questions
          </InputField>
        </div>
        <Article.Subheader>I want to receive emails about the following:</Article.Subheader>
        <div className={styles.formSectionContainer}>
          <Checkbox name="generalUpdates" onChange={(value) => setFormBoolean('generalUpdates', value)}>General updates to Outcrop Sketch</Checkbox>
          <Checkbox name="outcropPhotoSubmission" onChange={(value) => setFormBoolean('outcropPhotoLabeling', value)}>Photo submission opportunities</Checkbox>
          <Checkbox name="outcropPhotoLabeling" onChange={(value) => setFormBoolean('outcropPhotoSubmission', value)}>Photo labeling opportunities</Checkbox>
          <Checkbox name="stratificationLabPilot" onChange={(value) => setFormBoolean('stratificationLabPilot', value)}>Opportunities for piloting a sedimentary stratification lab</Checkbox>
          <div className={styles.submitButtonContainer}>
            <Typography className={styles.errorText} variant="body2">Please ensure the email you entered is valid.</Typography>
            <Button type="submit" disabled={!submissionValid}>Submit</Button>
          </div>
        </div>
      </form>
    </>
  );

  return (
    <StandardPage>
      {pageContent}
    </StandardPage>
  );
};

export default ContributePage;
