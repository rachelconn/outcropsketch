import paper from 'paper';
import SerializedProject from '../classes/serialization/project';
import downloadString from './downloadString';
import store from '..';

/**
 * Exports the project (including all labels, other layers, and the image) as JSON.
 */
export default function exportProjectToJSON() {
  const project: SerializedProject = {
    image: store.getState().image.URI,
    project: paper.project.exportJSON(),
  };

  downloadString(JSON.stringify(project), 'labeled.json');
};
