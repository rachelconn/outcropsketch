import paper from 'paper';
import store from '..';
import SerializedProject from '../classes/serialization/project';
import { setImage } from '../redux/actions/image';
import { restoreLabels } from './addLabel';

/**
 * Loads labels from a .json file containing a serialized paper.js project
 * @param file File to load labels from
 */
export default function loadLabelsFromFile(file: File) {
  file.text().then((text) => {
    const { image, project }: SerializedProject = JSON.parse(text);

    // Make sure data in the file has the expected properties, otherwise it cannot be handled
    if (!image || !project) {
      throw new Error('Label file in unexpected format.');
    }

    // Clear existing labels: not clearing the project completely beforehand
    // makes layers incorrectly deserialize
    paper.project.clear();

    // Load new labels from file
    // TODO: this can fail but it will still have cleared the existing labels, do we care enough to serialize
    // and then restore them if needed in the error handler?
    paper.project.importJSON(project);

    // Load image from file
    store.dispatch(setImage(image));

    // Make labeled items show labels on hover again
    restoreLabels();
  }).catch((error) => {
    window.alert(`Error loading labels from file: ${error}`)
  });
}
