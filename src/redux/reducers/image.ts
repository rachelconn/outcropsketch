import {
  ImageAction,
  DECREASE_IMAGE_SCALE,
  INCREASE_IMAGE_SCALE,
  SET_IMAGE,
  SET_IMAGE_SCALE,
  SET_LABELS_VISIBLE,
} from '../actions/image';
import { clearAllLayers } from '../../utils/paperLayers';

// Interface for the image state slice
export interface Image {
  URI: string,
  name: string,
  scale: number,
  labelsVisible: boolean,
  // version is incremented whenever the image should be cleared, and can be watched by the frontend to dispatch actions at the appropriate time
  version: number,
}

/**
 * State to use before any actions have been dispatched
 * @returns The default image state.
 */
function getDefaultState(): Image {
  return {
    URI: 'static/geo-default.jpg',
    name: 'default_outcrop.jpg',
    scale: 1,
    labelsVisible: false,
    version: 1,
  };
}

/**
 * Gets the previous scale level.
 * @param scale Scale to reduce
 */
function decreaseScale(scale: number): number {
  return Math.max(scale * 0.6666666, 0.0625);
}

/**
 * Gets the next scale level.
 * @param scale Scale to increase
 */
function increaseScale(scale: number): number {
  return Math.min(scale * 1.5, 12);
}

// Function to handle dispatched actions
export default function image(state = getDefaultState(), action: ImageAction): Image {
  switch (action.type) {
    case SET_IMAGE:
      if (action.shouldClear) clearAllLayers();
      return {
        ...state,
        URI: action.URI,
        name: action.name,
        version: action.shouldClear ? state.version + 1 : state.version,
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
    case SET_IMAGE_SCALE:
      return {
        ...state,
        scale: action.scale,
      }
    case SET_LABELS_VISIBLE:
      return {
        ...state,
        labelsVisible: action.visible,
      }
    default:
      return state;
  }
}
