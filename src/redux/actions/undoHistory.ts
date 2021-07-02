// Action types
export const UNDO = 'UNDO';
export const REDO = 'REDO';
export const ADD_STATE_TO_HISTORY = 'ADD_STATE_TO_HISTORY';

// Action interfaces
export interface UndoAction {
  type: 'UNDO',
}

export interface RedoAction {
  type: 'REDO',
}

export interface AddStateToHistoryAction {
  type: 'ADD_STATE_TO_HISTORY',
}

// Action creators
export function undo(): UndoAction {
  return {
    type: UNDO,
  };
}

export function redo(): RedoAction {
  return {
    type: REDO,
  };
}

export function addStateToHistory(): AddStateToHistoryAction {
  return {
    type: ADD_STATE_TO_HISTORY,
  };
}

export type UndoHistoryAction = (
  UndoAction
  | RedoAction
  | AddStateToHistoryAction
);
