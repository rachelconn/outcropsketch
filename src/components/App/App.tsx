import * as React from 'react';
import { serializeProject } from '../../utils/exportProjectToJSON';
import { loadLabelsFromString } from '../../utils/loadLabelsFromFile';
import SketchCanvas from '../SketchCanvas/SketchCanvas';
import ToolOptions from '../ToolOptions/ToolOptions';
import LabelToolSelect from '../ToolPicker/LabelToolSelect/LabelToolSelect';
import ToolPicker from '../ToolPicker/ToolPicker';
import styles from './App.css';

const LAST_LABEL_DATA_STORAGE_KEY = 'lastLabelData';
const LABEL_SAVE_INTERVAL_MS = 15000;

const App: React.FC = () => {
  React.useEffect(() => {
    // If a labeled project exists, load it
    const lastLabelData = window.localStorage.getItem(LAST_LABEL_DATA_STORAGE_KEY);
    if (lastLabelData) loadLabelsFromString(lastLabelData, false, false);

    // Prompt user before close to prevent closing without saving
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
    });
  }, []);

  // Periodically save labels to local storage to prevent data loss and make continuing to label easier
  setInterval(() => {
    window.localStorage.setItem(LAST_LABEL_DATA_STORAGE_KEY, serializeProject());
  }, LABEL_SAVE_INTERVAL_MS);

  return (
    <div className={styles.appContainer}>
      <div className={styles.toolbox}>
        <LabelToolSelect />
        <div className={styles.sidePadding}>
          <div className={styles.topPadding}>
            <ToolPicker />
          </div>
          <ToolOptions />
        </div>
      </div>
      <SketchCanvas />
    </div>
  );
};

export default App;
