import * as React from 'react';
import LabelingTool from '../LabelingTool/LabelingTool';
import LandingPage from '../LandingPage/LandingPage';

const App: React.FC = () => {
  return (
    <LandingPage />
  );
};

export default App;
// Allow importing with require() to allow conditional import
module.exports = App;
