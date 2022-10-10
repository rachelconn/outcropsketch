import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Article from '../common/Article';
import StandardPage from '../common/StandardPage/StandardPage';

const UserGuide: React.FC<RouteComponentProps> = () => {
  return (
    <StandardPage>
      <Article.EmbeddedPresentation src="https://docs.google.com/presentation/d/e/2PACX-1vTUlPtia3bNUu3PZbE5nyVr5FqAQF2hgfCWKVbA5cqd6--VCJW1OZt7qHTdpMn8Tg/embed?start=false&loop=false&delayms=3000" />
    </StandardPage>
  );
};

export default UserGuide;
