// Action types
export const UNDO = 'UNDO';
export const REDO = 'REDO';
export const RESET_HISTORY = 'RESET_HISTORY';
export const ADD_STATE_TO_HISTORY = 'ADD_STATE_TO_HISTORY';

// Action interfaces
export interface UndoAction {
  type: 'UNDO',
}

export interface RedoAction {
  type: 'REDO',
}

export interface ResetHistoryAction {
  type: 'RESET_HISTORY',
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

export function resetHistory(): ResetHistoryAction {
  return {
    type: RESET_HISTORY
  }
}

export function addStateToHistory(): AddStateToHistoryAction {
  return {
    type: ADD_STATE_TO_HISTORY,
  };
}

export type UndoHistoryAction = (
  UndoAction
  | RedoAction
  | ResetHistoryAction
  | AddStateToHistoryAction
);
