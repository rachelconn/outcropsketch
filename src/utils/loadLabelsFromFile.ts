import paper from 'paper';
import store from '..';
import SerializedProject from '../classes/serialization/project';
import { setImage } from '../redux/actions/image';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { initializePaperLayers } from './paperLayers';

/**
 * Loads labels from a .json file containing a serialized paper.js project
 * @param s String containing a serialized paper.js project
 */
export function loadLabelsFromString(s: string) {
    const { image, project }: SerializedProject = JSON.parse(s);

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

    // Ensure all the expected layers exist in the project
    initializePaperLayers();

    // Load image from file
    store.dispatch(setImage(image));

    // Update undo history with loaded image
    store.dispatch(addStateToHistory());
}

/**
 * Loads labels from a .json file containing a serialized paper.js project
 * @param file File to load labels from
 */
export default function loadLabelsFromFile(file: File) {
  file.text().then((text) => {
    loadLabelsFromString(text);
  }).catch((error) => {
    window.alert(`Error loading labels from file: ${error}`)
  });
}
