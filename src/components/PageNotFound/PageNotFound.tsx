import React from 'react';
import { RouteComponentProps } from "@reach/router";
import StandardPage from "../common/StandardPage/StandardPage";
import Article from '../common/Article';

interface PageNotFoundProps extends RouteComponentProps {
  nested?: boolean,
}

const PageNotFound: React.FC<PageNotFoundProps> = ({ nested = false }) => {
  const pageContent = (
    <>
      <Article.Header>Page Not Found</Article.Header>
      <Article.Paragraph>The page you requested does not exist. Please return home and try again.</Article.Paragraph>
    </>
  );

  // Check nested prop to avoid double-rendering the standard page layout in nested routes
  if (nested) return pageContent;

  return (
    <StandardPage>
      {pageContent}
    </StandardPage>
  );
};

export default PageNotFound;
