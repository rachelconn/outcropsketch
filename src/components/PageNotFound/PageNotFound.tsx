import React from 'react';
import { RouteComponentProps } from "@reach/router";
import StandardPage from "../common/StandardPage/StandardPage";
import Article from '../common/Article';

const PageNotFound: React.FC<RouteComponentProps> = () => {
  return (
    <StandardPage>
      <Article.Header>Page Not Found</Article.Header>
      <Article.Paragraph>The page you requested does not exist. Please return home and try again.</Article.Paragraph>
    </StandardPage>
  );
};

export default PageNotFound;
