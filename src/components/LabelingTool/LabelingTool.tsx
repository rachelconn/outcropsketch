import Cookies from 'js-cookie';
import paper from 'paper-jsdom-canvas';
import React from 'react';
import { CourseProps } from '../../classes/API/APIClasses';
import { RouteComponentProps, useNavigate, useParams } from '@reach/router';
import { serializeProject } from '../../utils/exportProjectToJSON';
import { loadLabelsFromJSON, loadLabelsFromString } from '../../utils/loadLabelsFromFile';
import styles from './LabelingTool.css';
import Button from './common/Button/Button';
import SketchCanvas from './SketchCanvas/SketchCanvas';
import ToolOptions from './ToolOptions/ToolOptions';
import LabelToolSelect from './ToolPicker/LabelToolSelect/LabelToolSelect';
import ToolPicker from './ToolPicker/ToolPicker';
import saveIcon from '../../icons/save.svg';
import SerializedProject from '../../classes/serialization/project';
import { Provider } from 'react-redux';
import store from '../../redux/store';


const LAST_LABEL_DATA_STORAGE_KEY = 'lastLabelData';
const LABEL_SAVE_INTERVAL_MS = 15000;

interface LabelingToolProps extends RouteComponentProps<{
  location: {
    state?: {
      course: CourseProps;
      imageURL: string;
      isOwner: boolean;
    }
  }
}> {}

// TODO: make sure clean initial render is performed when navigating away from labeling tool and then initializing it again
const LabelingTool: React.FC<LabelingToolProps> = ({ location }) => {
  const navigate = useNavigate();
  const { imageId } = useParams();
  const [visible, setVisible] = React.useState(false);
  const [labeledImage, setLabeledImage] = React.useState<string>();
  const [studentAnnotation, setStudentAnnotation] = React.useState<string>();

  const imageURL = location.state?.imageURL;
  const editingRemoteImage = Boolean(imageURL);

  React.useEffect(() => {

    // Load existing labels: use LabeledImage model if the param is set, else load from local storage
    if (editingRemoteImage) {
      // Fetch original annotation (includes image data)
      fetch(imageURL)
        .then((response) => {
          if (response.ok) return response.text();
          throw new Error('Error loading from provided URL. Please try again later.');
        })
        .then((jsonString) => {
          setLabeledImage(jsonString);
        })
        .catch((error) => {
          // TODO: use ErrorAlert
          console.error(error);
          setVisible(true);
        });

        // If not the owner, fetch your own annotation
        if (!location.state.isOwner) {
          fetch(`/courses/user_annotation/${imageId}`, { redirect: 'follow' })
            .then((response) => {
              if (response.ok) return response.text();
              throw new Error('Error loading from provided URL. Please try again later.');
            })
            .then((annotation) => setStudentAnnotation(annotation))
            .catch((error) => {
              console.error(error);
              setVisible(true);
            })
        }
    }

    // Not editing a remote image, load from local storage
    else {
      const lastLabelData = window.localStorage.getItem(LAST_LABEL_DATA_STORAGE_KEY);
      if (lastLabelData) {
        loadLabelsFromString(lastLabelData, { propagateError: false })
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

  // Render remote image when the appropriate fetches are completed
  React.useEffect(() => {
    // Ignore if already done rendering
    if (visible) return;
    if (labeledImage && location.state.isOwner) {
      loadLabelsFromString(labeledImage, { propagateError: false })
        .then(() => setVisible(true));
    }
    else if (labeledImage && studentAnnotation !== undefined) {
      const labeledImageJSON: SerializedProject = JSON.parse(labeledImage);
      labeledImageJSON.project = JSON.parse(studentAnnotation);
      loadLabelsFromJSON(labeledImageJSON, { propagateError: false })
        .then(() => setVisible(true));
    }
  }, [labeledImage, studentAnnotation, visible]);

  // Hide until saved image is loaded
  const containerStyle: React.CSSProperties = visible ? {} : { visibility: 'hidden' };

  let remoteImageSaveButton = undefined;
  if (editingRemoteImage) {
    const handleSaveRemoteClick = () => {
      const baseURL = location.state.isOwner ? '/courses/update_image' : `/courses/${location.state.course.courseCode}/submit_annotation`;
      const body = new FormData();
      body.append('image', serializeProject());

      fetch(`${baseURL}/${imageId}`, {
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
    <Provider store={store}>
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
    </Provider>
  );
};

export default LabelingTool;
// Allow importing with require() to allow conditional import
module.exports = LabelingTool;
