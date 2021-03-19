import * as React from 'react';
import SketchCanvas from '../SketchCanvas/SketchCanvas';
import ToolPicker from '../ToolPicker/ToolPicker';
import styles from './App.css';

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <ToolPicker />
      <SketchCanvas />
    </div>
  );
};

export default App;
