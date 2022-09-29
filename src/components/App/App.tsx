import * as React from 'react';
import LabelingTool from '../LabelingTool/LabelingTool';

const App: React.FC = () => {
  return (
    <LabelingTool />
  );
};

export default App;
// Allow importing with require() to allow conditional import
module.exports = App;
