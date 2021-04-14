import { DECREASE_IMAGE_SCALE, ImageAction, INCREASE_IMAGE_SCALE, SET_IMAGE } from '../actions/image';
import rockImage from '../../images/geo-default.jpg';


// Interface for the image state slice
export interface Image {
  URI: string,
  scale: number,
}

/**
 * State to use before any actions have been dispatched
 * @returns The default image state.
 */
function getDefaultState(): Image {
  return {
    URI: rockImage,
    scale: 1,
  };
}

// Possible zoom levels
const scaleLevels = [0.0625, 0.125, 0.25, 0.5, 1, 2, 3, 4, 6, 8];

/**
 * Gets the previous scale level.
 * @param scale Scale to reduce
 */
function decreaseScale(scale: number): number {
  // Could use binary search but who cares
  let scaleIdx = scaleLevels.findIndex((scaleLevel) => scale === scaleLevel);
  console.assert(scaleIdx !== undefined, `Invalid scale ${scale}`);
  if (scaleIdx > 0) scaleIdx -= 1;
  return scaleLevels[scaleIdx];
}

/**
 * Gets the next scale level.
 * @param scale Scale to increase
 */
function increaseScale(scale: number): number {
  // Could use binary search but who cares
  let scaleIdx = scaleLevels.findIndex((scaleLevel) => scale === scaleLevel);
  console.assert(scaleIdx !== undefined, `Invalid scale ${scale}`);
  if (scaleIdx < scaleLevels.length - 1) scaleIdx += 1;
  return scaleLevels[scaleIdx];
}

// Function to handle dispatched actions
export default function image(state = getDefaultState(), action: ImageAction): Image {
  switch (action.type) {
    case SET_IMAGE:
      return {
        ...state,
        URI: action.URI,
      };
    case INCREASE_IMAGE_SCALE:
      return {
        ...state,
        scale: increaseScale(state.scale),
      };
    case DECREASE_IMAGE_SCALE:
      return {
        ...state,
        scale: decreaseScale(state.scale),
      };
    default:
      return state;
  }
}
