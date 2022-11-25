import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { serializeProject } from '../../utils/exportProjectToJSON';
import { loadLabelsFromString } from '../../utils/loadLabelsFromFile';
import styles from './LabelingTool.css';
import SketchCanvas from './SketchCanvas/SketchCanvas';
import ToolOptions from './ToolOptions/ToolOptions';
import LabelToolSelect from './ToolPicker/LabelToolSelect/LabelToolSelect';
import ToolPicker from './ToolPicker/ToolPicker';

const LAST_LABEL_DATA_STORAGE_KEY = 'lastLabelData';
const LABEL_SAVE_INTERVAL_MS = 15000;

const LabelingTool: React.FC<RouteComponentProps> = () => {
  React.useEffect(() => {
    // If a labeled project exists, load it
    const lastLabelData = window.localStorage.getItem(LAST_LABEL_DATA_STORAGE_KEY);
    if (lastLabelData) loadLabelsFromString(lastLabelData, true, false);

    // Prompt user before close to prevent closing without saving
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
    });

    // Periodically save labels to local storage to prevent data loss and make continuing to label easier
    const saveInterval = setInterval(() => {
      window.localStorage.setItem(LAST_LABEL_DATA_STORAGE_KEY, serializeProject());
    }, LABEL_SAVE_INTERVAL_MS);

    return () => clearInterval(saveInterval);
  }, []);


  return (
    <div className={styles.labelingToolContainer}>
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

export default LabelingTool;
// Allow importing with require() to allow conditional import
module.exports = LabelingTool;
