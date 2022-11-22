import * as React from 'react';
import Button from '../Button/Button';
import Typography from '../Typography/Typography';
import Section from './Section';
import styles from './styles.css';

interface FormContainerProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => any;
  errorText: string;
};

const Container: React.FC<FormContainerProps> = ({
  errorText,
  onSubmit,
  children,
}) => {
  return (
    <form className={styles.formContainer} onSubmit={onSubmit}>
      {children}
      <Section>
        <div className={styles.submitButtonContainer}>
          <Typography className={styles.errorText} variant="body2">{errorText}</Typography>
          <Button type="submit" disabled={Boolean(errorText)}>Submit</Button>
        </div>
      </Section>
    </form>
  );
};

export default Container;
