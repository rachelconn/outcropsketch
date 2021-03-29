import paper from 'paper';

/**
 * Loads labels from a .json file containing a serialized paper.js project
 * @param file File to load labels from
 */
export default function loadLabelsFromFile(file: File) {
  file.text().then((text) => {
    // Clear existing labels
    paper.project.clear();

    // Load new labels from file
    // TODO: this can fail but it will still have cleared the existing labels, do we care enough to serialize
    // and then restore them if needed in the error handler?
    paper.project.importJSON(text);
  }).catch((error) => {
    window.alert(`Error loading labels from file: ${error}`)
  });
}
