import paper from 'paper';
import { ADD_STATE_TO_HISTORY, REDO, UNDO, UndoHistoryAction } from '../actions/undoHistory';
import awaitCondition from '../../utils/awaitCondition';

const UNDO_STACK_SIZE = 50;

// Interface for the undoHistory state slice
export interface UndoHistory {
  stackPosition: number, // position of the current stack entry
  lastValidPosition: number, // position of the last valid stack entry
  undoStack: string[], // undo/redo stack
  canUndo: boolean, // whether undoing is possible
  canRedo: boolean,	// whether redoing is possible
}

let initialized = false;

/**
 * Waits for the project to be fully initialized so that it can be successfully read and modified
 * by functions that need it
 * @returns A promise that resolves once the project has been initialized
 */
export function waitForProjectLoad(): Promise<void> {
  return awaitCondition(() => initialized);
}

/**
 * State to use before any actions have been dispatched
 * @returns The default undoHistory state.
 */
function getDefaultState(): UndoHistory {
  const undoStack = new Array(UNDO_STACK_SIZE);
  // Initialize first item to empty
  awaitCondition(() => paper.project).then(() => {
    undoStack[0] = paper.project.exportJSON();
    initialized = true;
  });

  return {
    stackPosition: 0,
    lastValidPosition: 0,
    undoStack,
    canUndo: false,
    canRedo: false,
  };
}

// Function to handle dispatched actions
export default function undoHistory(state = getDefaultState(), action: UndoHistoryAction): UndoHistory {
  switch (action.type) {
    case ADD_STATE_TO_HISTORY: {
      // Determine new stack position
      let stackPosition = state.stackPosition;
      let undoStack: string[];
      if (state.stackPosition < UNDO_STACK_SIZE - 1) {
        stackPosition += 1;
        undoStack = [...state.undoStack];
      }
      else {
        undoStack = state.undoStack.slice(1);
        undoStack.push(undefined);
      }
      undoStack[stackPosition] = paper.project.exportJSON();

      return {
        stackPosition,
        lastValidPosition: stackPosition,
        undoStack,
        canUndo: true,
        canRedo: false,
      };
    }
    case UNDO: {
      if (!state.canUndo) return state;
      const stackPosition = state.stackPosition - 1;
      paper.project.clear();
      if (state.undoStack[stackPosition]) paper.project.importJSON(state.undoStack[stackPosition]);

      return {
        ...state,
        stackPosition,
        canUndo: stackPosition > 0,
        canRedo: true,
      }
    }
    case REDO: {
      if (!state.canRedo) return state;
      const stackPosition = state.stackPosition + 1;
      paper.project.clear();
      paper.project.importJSON(state.undoStack[stackPosition]);

      return {
        ...state,
        stackPosition,
        canUndo: true,
        canRedo: stackPosition < state.lastValidPosition,
      }
    }
    default:
      return state;
  }
}
