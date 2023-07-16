import { SerializedLabelTypes } from "../classes/serialization/project";
import { setLabels } from "../redux/actions/labels";
import labels, { defaultLabels } from "../redux/reducers/labels";
import store from "../redux/store";
import downloadString from "./downloadString";

export function loadLabelTypesFromFile() {
  // Attempt to reuse input element since detecting cancel is not possible
  let input: HTMLInputElement = document.getElementById('labeltypefileupload') as HTMLInputElement;
  if (input === null) {
    input = document.createElement('input');
    document.body.appendChild(input);
    input.style.display = 'none';
    input.type = 'file';
    input.accept = '.json,.oslabel';
  }

  // Prompt user to upload file
  input.click();

  // Listen for file upload
  input.onchange = (e) => {
    const file = (<HTMLInputElement>e.target).files[0];
    file.text()
      .then((text) => {
        // Set label types
        const labelTypes: SerializedLabelTypes = JSON.parse(text);
        if (!labelTypes) return;
        // If serialized file doesn't contain label types, it has the default ones - import those
        const labelsToImport = labelTypes.labels ?? defaultLabels;
        store.dispatch(setLabels(labelsToImport));

      })
      .catch((e) => {
            window.alert(`Error loading label types from file:\n${e.message}`);
      })
      .finally(() => {
        // Remove input element as it is no longer necessary
        input.remove();
      });

  };
}

export function saveLabelTypes() {
  const labels: SerializedLabelTypes = {
    labels: store.getState().undoHistory.labels.labels,
  };
  const filename = `${store.getState().image.name}.oslabel`;
  downloadString(JSON.stringify(labels), filename);
}
