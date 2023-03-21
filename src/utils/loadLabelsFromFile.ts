import paper from 'paper-jsdom-canvas';
import SerializedProject from '../classes/serialization/project';
import { setImage } from '../redux/actions/image';
import { resetHistory } from '../redux/actions/undoHistory';
import { waitForProjectLoad } from '../redux/reducers/undoHistory';
import store from '../redux/store';
import { versionLoadable } from './exportProjectToJSON';

export function loadLabelsFromJSON(json: SerializedProject, loadIfBlank = true, propagateError = true): Promise<void> {
  // Serialize the current project state in case something goes wrong
  const currentState = paper.project.exportJSON();

  return waitForProjectLoad().then(() => {
    const { image, imageName, project, version } = json;

    // Make sure data in the file has the expected properties, otherwise it cannot be handled
    if (!image || project === undefined || !imageName) {
      throw new Error('Label file in unexpected format.');
    }

    if (!versionLoadable(version)) throw new Error('Attempted to load incompatible label version.');

    // Don't load project if completely blank (meaning a remote image with no annotation data)
    if (project) {
      // Remember layer opacities so they can be restored when loading
      const layerOpacities = new Map<string, number>(
        paper.project.layers.map((layer) => [layer.name, layer.opacity])
      );

      // // Clear existing labels: not clearing the project completely beforehand
      // // makes layers incorrectly deserialize
      paper.project.clear();

      // Load new labels from file
      paper.project.importJSON(project);

      // Restore previously set layer visibilities
      layerOpacities.forEach((opacity, layerName) => {
        let layer = paper.project.layers[layerName];
        if (!layer) {
          layer = new paper.Layer({ name: layerName });
        }
        layer.opacity = opacity;
      });

      if (!loadIfBlank) {
        // If loadIfBlank isn't set, check if the loaded project is blank and reset to old state if so
        if (!paper.project.layers.some((layer) => layer.children.length)) throw new Error('Project was blank.');
      }
    }

    // Load image from file
    store.dispatch(setImage(image, imageName, false));
    store.dispatch(resetHistory());
  }).catch((e) => {
    // If an error is thrown, reset the initial state
    paper.project.importJSON(currentState);
    if (propagateError) throw e;
  });
}

/**
 * Loads labels from a .json file containing a serialized paper.js project
 * @param s String containing a serialized paper.js project
 */
export function loadLabelsFromString(s: string, loadIfBlank = true, propagateError = true): Promise<void> {
  return loadLabelsFromJSON(JSON.parse(s) as SerializedProject, loadIfBlank, propagateError);
}

/**
 * Loads labels from a .json file containing a serialized paper.js project
 * @param file File to load labels from
 */
export default function loadLabelsFromFile(file: File) {
  file.text()
    .then(loadLabelsFromString)
    .catch((e) => {
      window.alert(`Error loading labels from file:\n${e.message}`)
    });
}
