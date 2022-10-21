import { setImage } from '../redux/actions/image';
import store from '../redux/store';

// FileReader that handles images on load
const reader = new FileReader();
let filename: string;
reader.addEventListener('load', () => {
  store.dispatch(setImage(reader.result as string, filename, true));
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
  filename = file.name;
  reader.readAsDataURL(file);
}
