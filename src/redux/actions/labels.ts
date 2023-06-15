import { Label } from "../../classes/labeling/labeling";

// Action types
export const ADD_LABEL = 'ADD_LABEL';
export const REMOVE_LABEL = 'REMOVE_LABEL';
export const SET_LABELS = 'SET_LABELS';

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

export type LabelsAction = (
  AddLabelAction
  | RemoveLabelAction
  | SetLabelsAction
);
