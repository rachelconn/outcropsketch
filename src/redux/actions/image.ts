// Action types
export const SET_IMAGE = 'SET_IMAGE';
export const INCREASE_IMAGE_SCALE = 'INCREASE_IMAGE_SCALE';
export const DECREASE_IMAGE_SCALE = 'DECREASE_IMAGE_SCALE';

// Action interfaces
export interface SetImageAction {
  type: 'SET_IMAGE',
  URI: string,
}

export interface IncreaseImageScaleAction {
  type: 'INCREASE_IMAGE_SCALE',
}

export interface DecreaseImageScaleAction {
  type: 'DECREASE_IMAGE_SCALE',
}


export function setImage(URI: string): SetImageAction {
  return {
    type: SET_IMAGE,
    URI,
  };
}

// Action creators
export function increaseImageScale(): IncreaseImageScaleAction {
  return {
    type: INCREASE_IMAGE_SCALE
  };
}


export function decreaseImageScale(): DecreaseImageScaleAction {
  return {
    type: DECREASE_IMAGE_SCALE
  };
}

export type ImageAction = SetImageAction | IncreaseImageScaleAction | DecreaseImageScaleAction;
