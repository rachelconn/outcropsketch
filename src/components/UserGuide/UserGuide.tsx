import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Article from '../common/Article';
import StandardPage from '../common/StandardPage/StandardPage';

const UserGuide: React.FC<RouteComponentProps> = () => {
  return (
    <StandardPage>
      <Article.Paragraph>
        TODO: put powerpoint on this page!
      </Article.Paragraph>
    </StandardPage>
  );
};

export default UserGuide;
