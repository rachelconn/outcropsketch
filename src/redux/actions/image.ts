export const SET_IMAGE = 'SET_IMAGE';

export interface SetImageAction {
  type: 'SET_IMAGE',
  URI: string,
}

export type ImageAction = SetImageAction;

export function setImage(URI: string): SetImageAction {
  return {
    type: SET_IMAGE,
    URI,
  };
}
