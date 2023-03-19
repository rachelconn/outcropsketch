import Cookies from 'js-cookie';
import React from 'react';
import { CourseProps } from '../../classes/API/APIClasses';
import { RouteComponentProps, useNavigate, useParams } from '@reach/router';
import { serializeProject } from '../../utils/exportProjectToJSON';
import { loadLabelsFromString } from '../../utils/loadLabelsFromFile';
import styles from './LabelingTool.css';
import Button from './common/Button/Button';
import SketchCanvas from './SketchCanvas/SketchCanvas';
import ToolOptions from './ToolOptions/ToolOptions';
import LabelToolSelect from './ToolPicker/LabelToolSelect/LabelToolSelect';
import ToolPicker from './ToolPicker/ToolPicker';
import saveIcon from '../../icons/save.svg';


const LAST_LABEL_DATA_STORAGE_KEY = 'lastLabelData';
const LABEL_SAVE_INTERVAL_MS = 15000;

interface LabelingToolProps extends RouteComponentProps<{
  location: {
    state?: {
      course: CourseProps;
      imageURL: string;
    }
  }
}> {}

const LabelingTool: React.FC<LabelingToolProps> = ({ location }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [visible, setVisible] = React.useState(false);

  const imageURL = location.state?.imageURL;
  const editingRemoteImage = Boolean(imageURL);

  React.useEffect(() => {

    // Load existing labels: use LabeledImage model if the param is set, else load from local storage
    if (editingRemoteImage) {
      fetch(imageURL)
        .then((response) => {
          if (response.ok) return response.text();
          else throw new Error('Error loading from provided URL. Please try again later.');
        })
        .then((jsonString) => {
          loadLabelsFromString(jsonString, true, false);
        })
        .then(() => {
          setVisible(true);
        })
        .catch((error) => {
          // TODO: use ErrorAlert
          console.error(error);
          setVisible(true);
        });
    }
    else {
      const lastLabelData = window.localStorage.getItem(LAST_LABEL_DATA_STORAGE_KEY);
      if (lastLabelData) {
        loadLabelsFromString(lastLabelData, true, false)
          .then(() => {
            setVisible(true)
          });
      }
      else setVisible(true);
    }

    // Prompt user before close to prevent closing without saving
    const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Periodically save labels to local storage to prevent data loss and make continuing to label easier
    if (!editingRemoteImage) {
      const saveInterval = setInterval(() => {
        window.localStorage.setItem(LAST_LABEL_DATA_STORAGE_KEY, serializeProject());
      }, LABEL_SAVE_INTERVAL_MS);

      return () => {
        clearInterval(saveInterval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);

  // Hide until saved image is loaded
  const containerStyle: React.CSSProperties = visible ? {} : { visibility: 'hidden' };

  let remoteImageSaveButton = undefined;
  if (editingRemoteImage) {
    const handleSaveRemoteClick = () => {
      // TODO: use a separate URL for non-owner submissions
      const baseURL = '/courses/update_image';
      const body = new FormData();
      body.append('image', serializeProject());

      fetch(`${baseURL}/${params.imageId}`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body,
      })
        .then((response) => {
          if (response.ok) navigate(`/mycourses/${location.state.course.courseCode}/manage`);
        })
    };

    remoteImageSaveButton = (
      <div className={styles.saveButtonContainer}>
        <Button color="primary" icon={saveIcon} onClick={handleSaveRemoteClick}>Done Editing</Button>
      </div>
    );
  }

  return (
    <div style={containerStyle} className={styles.labelingToolContainer}>
      <div className={styles.toolbox}>
        <LabelToolSelect />
        <div className={styles.sidePadding}>
          <div className={styles.topPadding}>
            <ToolPicker enableLoading={!editingRemoteImage} />
          </div>
          <ToolOptions />
        </div>
        {remoteImageSaveButton}
      </div>
      <SketchCanvas />
    </div>
  );
};

export default LabelingTool;
// Allow importing with require() to allow conditional import
module.exports = LabelingTool;
