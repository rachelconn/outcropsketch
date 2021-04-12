import { ImageAction, SET_IMAGE } from '../actions/image';
import rockImage from '../../images/geo-default.jpg';


export interface Image {
  URI: string,
}

function getDefaultState(): Image {
  return {
    URI: rockImage,
  };
}

export default function image(state = getDefaultState(), action: ImageAction): Image {
  switch (action.type) {
    case SET_IMAGE:
      return {
        URI: action.URI,
      }
    default:
      return state;
  }
}
