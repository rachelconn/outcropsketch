import * as React from 'react';
import SketchCanvas from '../SketchCanvas/SketchCanvas';
import ToolOptions from '../ToolOptions/ToolOptions';
import ToolPicker from '../ToolPicker/ToolPicker';
import styles from './App.css';

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <div className={styles.toolbox}>
        <ToolPicker />
        <ToolOptions />
      </div>
      <SketchCanvas />
    </div>
  );
};

export default App;
