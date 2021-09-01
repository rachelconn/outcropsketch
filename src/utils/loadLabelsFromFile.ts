import paper from 'paper';
import store from '..';
import SerializedProject from '../classes/serialization/project';
import { setImage } from '../redux/actions/image';
import { addStateToHistory } from '../redux/actions/undoHistory';
import { waitForProjectLoad } from '../redux/reducers/undoHistory';
import { initializePaperLayers } from './paperLayers';

/**
 * Loads labels from a .json file containing a serialized paper.js project
 * @param s String containing a serialized paper.js project
 */
export function loadLabelsFromString(s: string, loadIfBlank = true) {
  // Serialize the current project state in case something goes wrong
  const currentState = paper.project.exportJSON();

  waitForProjectLoad().then(() => {
    const { image, project }: SerializedProject = JSON.parse(s);

    // Make sure data in the file has the expected properties, otherwise it cannot be handled
    if (!image || !project) {
      throw new Error('Label file in unexpected format.');
    }


    // Clear existing labels: not clearing the project completely beforehand
    // makes layers incorrectly deserialize
    paper.project.clear();

    // Load new labels from file
    paper.project.importJSON(project);

    if (!loadIfBlank) {
      // If loadIfBlank isn't set, check if the loaded project is blank and reset to old state if so
      if (!paper.project.layers.some((layer) => layer.children.length)) throw new Error('Project was blank.');
    }

    // Ensure all the expected layers exist in the project
    initializePaperLayers();

    // Load image from file
    store.dispatch(setImage(image));

    // Update undo history with loaded image
    store.dispatch(addStateToHistory());
  }).catch(() => {
    // If an error is thrown, reset the initial state
    paper.project.importJSON(currentState);
  });
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
