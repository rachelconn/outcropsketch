import { Label, LabelType } from "../../classes/labeling/labeling";

// Action types
export const ADD_LABEL = 'ADD_LABEL';
export const REMOVE_LABEL = 'REMOVE_LABEL';
export const SET_LABELS = 'SET_LABELS';
export const SET_ACTIVE_LABEL_TYPE = 'SET_ACTIVE_LABEL_TYPE';

// Action interfaces
export interface AddLabelAction {
  type: 'ADD_LABEL',
  label: Label,
}

export interface RemoveLabelAction {
  type: 'REMOVE_LABEL',
  label: Label,
}

export interface SetLabelsAction {
  type: 'SET_LABELS',
  labels: Label[],
}

export interface SetActiveLabelTypeAction {
  type: 'SET_ACTIVE_LABEL_TYPE',
  labelType: LabelType,
}


// Actions
export function addLabel(label: Label): AddLabelAction {
  return {
    type: ADD_LABEL,
    label,
  };
}

export function removeLabel(label: Label): RemoveLabelAction {
  return {
    type: REMOVE_LABEL,
    label,
  };
}

export function setLabels(labels: Label[]): SetLabelsAction {
  return {
    type: SET_LABELS,
    labels,
  };
}

export function setActiveLabelType(labelType: LabelType): SetActiveLabelTypeAction {
  return {
    type: SET_ACTIVE_LABEL_TYPE,
    labelType,
  };
}

export type LabelsAction = (
  AddLabelAction
  | RemoveLabelAction
  | SetLabelsAction
  | SetActiveLabelTypeAction
);
