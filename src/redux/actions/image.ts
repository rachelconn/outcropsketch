// Action types
export const SET_IMAGE = 'SET_IMAGE';
export const INCREASE_IMAGE_SCALE = 'INCREASE_IMAGE_SCALE';
export const DECREASE_IMAGE_SCALE = 'DECREASE_IMAGE_SCALE';
export const SET_IMAGE_SCALE = 'SET_IMAGE_SCALE';
export const SET_LABELS_VISIBLE = 'SET_LABELS_VISIBLE';

// Action interfaces
export interface SetImageAction {
  type: 'SET_IMAGE',
  URI: string,
  name: string,
  // Whether the project should be cleared on load
  shouldClear: boolean,
}

export interface IncreaseImageScaleAction {
  type: 'INCREASE_IMAGE_SCALE',
}

export interface DecreaseImageScaleAction {
  type: 'DECREASE_IMAGE_SCALE',
}

export interface SetImageScaleAction {
  type: 'SET_IMAGE_SCALE',
  scale: number,
}

export interface SetLabelsVisibleAction {
  type: 'SET_LABELS_VISIBLE',
  visible: boolean,
}

// Action creators
export function setImage(URI: string, name: string, shouldClear: boolean): SetImageAction {
  return {
    type: SET_IMAGE,
    URI,
    name,
    shouldClear,
  };
}

export function increaseImageScale(): IncreaseImageScaleAction {
  return {
    type: INCREASE_IMAGE_SCALE,
  };
}

export function decreaseImageScale(): DecreaseImageScaleAction {
  return {
    type: DECREASE_IMAGE_SCALE,
  };
}

export function setImageScale(scale: number): SetImageScaleAction {
  return {
    type: SET_IMAGE_SCALE,
    scale,
  }
}

export function setLabelsVisible(visible: boolean): SetLabelsVisibleAction {
  return {
    type: SET_LABELS_VISIBLE,
    visible,
  };
}

export type ImageAction = (
  SetImageAction
  | IncreaseImageScaleAction
  | DecreaseImageScaleAction
  | SetImageScaleAction
  | SetLabelsVisibleAction
);
