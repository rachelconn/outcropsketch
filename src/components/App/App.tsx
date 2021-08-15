import * as React from 'react';
import Typography from '../common/Typography/Typography';
import LayerOptions from '../LayerOptions/LayerOptions';
import SketchCanvas from '../SketchCanvas/SketchCanvas';
import ToolOptions from '../ToolOptions/ToolOptions';
import LabelToolSelect from '../ToolPicker/LabelToolSelect/LabelToolSelect';
import ToolPicker from '../ToolPicker/ToolPicker';
import styles from './App.css';

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <div className={styles.toolbox}>
        <LabelToolSelect />
        <div className={styles.sidePadding}>
          <div className={styles.topPadding}>
            <ToolPicker />
          </div>
          <Typography className={styles.leftAlign} variant="h5">Layer Options</Typography>
          <LayerOptions />
          <Typography className={styles.leftAlign} variant="h5">Tool Options</Typography>
          <ToolOptions />
        </div>
      </div>
      <SketchCanvas />
    </div>
  );
};

export default App;
