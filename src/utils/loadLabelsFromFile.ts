import paper from 'paper-jsdom-canvas';
import { Store } from 'redux';
import SerializedProject from '../classes/serialization/project';
import { setImage } from '../redux/actions/image';
import { resetHistory } from '../redux/actions/undoHistory';
import { waitForProjectLoad } from '../redux/reducers/undoHistory';
import defaultStore from '../redux/store';
import awaitCondition from './awaitCondition';
import { versionLoadable } from './exportProjectToJSON';
import { setLabels } from '../redux/actions/labels';
import { defaultLabels } from '../redux/reducers/labels';

interface LoadLabelSettings {
  propagateError?: boolean,
  paperScope?: paper.PaperScope,
  store?: Store,
}

export function loadLabelsFromJSON(json: SerializedProject, {
  propagateError = true,
  paperScope = paper,
  store = defaultStore,
}: LoadLabelSettings): Promise<void> {
  // Serialize the current project state in case something goes wrong
  const initialState = paperScope.project.exportJSON();
  const initialLabels = store.getState().undoHistory.labels.labels;

  const waitScopeInitialized = (paperScope === paper)
    ? waitForProjectLoad
    : () => awaitCondition(() => paperScope.project);

  return waitScopeInitialized().then(() => {
    const { image, imageName, project, version, labels } = json;

    // Make sure data in the file has the expected properties, otherwise it cannot be handled
    if (!image || project === undefined || !imageName) {
      throw new Error('Label file in unexpected format.');
    }

    if (!versionLoadable(version)) throw new Error('Attempted to load incompatible label version.');

    // Don't load project if completely blank (meaning a remote image with no annotation data)
    if (project) {
      // Remember layer opacities so they can be restored when loading
      const layerOpacities = new Map<string, number>(
        paperScope.project.layers.map((layer) => [layer.name, layer.opacity])
      );

      // // Clear existing labels: not clearing the project completely beforehand
      // // makes layers incorrectly deserialize
      paperScope.project.clear();

      // Restore label types - use from json if present, otherwise the default labels were used (label file created before custom label types)
      const newLabels = labels ?? defaultLabels;
      store.dispatch(setLabels(newLabels));

      // Load new labels from file
      paperScope.activate();
      paperScope.project.importJSON(project);
      paper.activate();


      // Restore previously set layer visibilities
      layerOpacities.forEach((opacity, layerName) => {
        let layer = paperScope.project.layers[layerName];
        if (!layer) {
          layer = new paperScope.Layer({ name: layerName });
        }
        layer.opacity = opacity;
      });
    }

    // Load image from file
    store.dispatch(setImage(image, imageName, false));
    // Only reset history if using the default paper scope (as others lack the redux slice)
    if (paperScope === paper) store.dispatch(resetHistory());
  }).catch((e) => {
    // If an error is thrown, reset the initial state
    paperScope.project.importJSON(initialState);
    store.dispatch(setLabels(initialLabels));
    if (propagateError) throw e;
  });
}

/**
 * Loads labels from a .json file containing a serialized paper.js project
 * @param s String containing a serialized paper.js project
 */
export function loadLabelsFromString(s: string, kwargs: LoadLabelSettings): Promise<void> {
  return loadLabelsFromJSON(JSON.parse(s) as SerializedProject, kwargs);
}

/**
 * Loads labels from a .json file containing a serialized paper.js project
 * @param file File to load labels from
 */
export default function loadLabelsFromFile(file: File) {
  file.text()
    .then((s) => loadLabelsFromString(s, {}))
    .catch((e) => {
      window.alert(`Error loading labels from file:\n${e.message}`)
    });
}
