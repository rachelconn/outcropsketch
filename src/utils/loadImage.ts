import paper from 'paper';
import store from '..';
import { setImage } from '../redux/actions/image';
import { clearAllLayers } from './paperLayers';

// FileReader that handles images on load
const reader = new FileReader();
reader.addEventListener('load', () => {
  clearAllLayers();
  store.dispatch(setImage(reader.result as string));
});

/**
 * Loads image into the canvas from a file
 * @param file File to load
 */
export default function loadImage(file: File) {
  // Make sure file is a valid image
  if (!file.type.startsWith('image/')) {
    window.alert(`File ${file.name} is not a valid image (jpg/png), please try another file.`);
    return;
  }

  // Load image
  reader.readAsDataURL(file);
}
