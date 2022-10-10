import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Article from '../common/Article';
import StandardPage from '../common/StandardPage/StandardPage';
import { useForm } from '@formspree/react';

const ContributePage: React.FC<RouteComponentProps> = () => {
  const [state, handleSubmit] = useForm('mgeqzyal');

  const pageContent = state.succeeded ? (
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
        </a>.
        Thank you for your interest in helping Outcrop Sketch!
      </Article.Paragraph>
      <form onSubmit={handleSubmit}>
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
