import paper from 'paper';
import { ADD_STATE_TO_HISTORY, REDO, UNDO, UndoHistoryAction } from '../actions/undoHistory';
import awaitCondition from '../../utils/awaitCondition';
import { ExportedProject } from '../../classes/paperjs/types';

const UNDO_STACK_SIZE = 50;

// Interface for the undoHistory state slice
export interface UndoHistory {
  stackPosition: number, // position of the current stack entry
  lastValidPosition: number, // position of the last valid stack entry
  undoStack: ExportedProject[], // undo/redo stack
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
  const undoStack = new Array<ExportedProject>(UNDO_STACK_SIZE);
  // Initialize first item to empty
  awaitCondition(() => paper.project).then(() => {
    undoStack[0] = paper.project.exportJSON({ asString: false }) as unknown as ExportedProject;
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

/**
 * Modifies a saved state so that it doesn't cause unexpected behavior on undo/redo,
 * then sets the current state to it.
 * @param newState State to update to
 */
function setProjectState(newState: ExportedProject) {
  // Sync opacities with the current ones - leads to more intuitive behavior
  newState.forEach(([itemType, item]) => {
    if (itemType === 'Layer') item.opacity = paper.project.layers[item.name].opacity;
  });

  // Import new project
  paper.project.clear();
  paper.project.importJSON(JSON.stringify(newState));
}

// Function to handle dispatched actions
export default function undoHistory(state = getDefaultState(), action: UndoHistoryAction): UndoHistory {
  switch (action.type) {
    case ADD_STATE_TO_HISTORY: {
      // Determine new stack position
      let stackPosition = state.stackPosition;
      let undoStack: ExportedProject[];
      if (state.stackPosition < UNDO_STACK_SIZE - 1) {
        stackPosition += 1;
        undoStack = [...state.undoStack];
      }
      else {
        undoStack = state.undoStack.slice(1);
        undoStack.push(undefined);
      }
      undoStack[stackPosition] = paper.project.exportJSON({ asString: false }) as unknown as ExportedProject;

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
      if (state.undoStack[stackPosition]) setProjectState(state.undoStack[stackPosition]);

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
      setProjectState(state.undoStack[stackPosition]);

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
