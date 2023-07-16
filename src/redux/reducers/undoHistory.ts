import paper from 'paper-jsdom-canvas';
import { ADD_STATE_TO_HISTORY, REDO, RESET_HISTORY, UNDO, UndoHistoryAction } from '../actions/undoHistory';
import awaitCondition from '../../utils/awaitCondition';
import { ExportedProject } from '../../classes/paperjs/types';
import { initializePaperLayers } from '../../utils/paperLayers';
import labels, { Labels } from './labels';
import { getDefaultState as getDefaultLabelsState } from './labels';
import { Label } from '../../classes/labeling/labeling';
import { ADD_LABEL, REMOVE_LABEL, SET_ACTIVE_LABEL_TYPE, SET_LABELS } from '../actions/labels';

const UNDO_STACK_SIZE = 50;

interface ProjectState {
  project: ExportedProject,
  addedLabels: Label[],
  removedLabels: Label[],
}

// Interface for the undoHistory state slice
export interface UndoHistory {
  stackPosition: number, // position of the current stack entry
  lastValidPosition: number, // position of the last valid stack entry
  undoStack: ProjectState[], // undo/redo stack
  canUndo: boolean, // whether undoing is possible
  canRedo: boolean,	// whether redoing is possible
  labels: Labels, // labels redux slice
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
  const undoStack = new Array<ProjectState>(UNDO_STACK_SIZE);
  // Initialize first item to empty
  awaitCondition(() => paper.project).then(() => {
    initializePaperLayers();

    undoStack[0] = {
      project: paper.project.exportJSON({ asString: false }) as unknown as ExportedProject,
      addedLabels: [],
      removedLabels: [],
    };

    initialized = true;
  });

  return {
    stackPosition: 0,
    lastValidPosition: 0,
    undoStack,
    canUndo: false,
    canRedo: false,
    labels: getDefaultLabelsState(),
  };
}

/**
 * Modifies a saved state so that it doesn't cause unexpected behavior on undo/redo,
 * then sets the current state to it.
 * @param newState State to update to
 */
function setProjectState(project: ExportedProject) {
  // Sync opacities with the current ones - leads to more intuitive behavior
  project.forEach(([itemType, item]) => {
    if (itemType === 'Layer') item.opacity = paper.project.layers[item.name].opacity;
  });

  // Import new project
  paper.project.clear();
  paper.project.importJSON(JSON.stringify(project));
}

// Helper function to add the project's current state to history
function addToHistory(currentState: UndoHistory, addedLabels: Label[] = [], removedLabels: Label[] = []): UndoHistory {
  // Determine new stack position
  let stackPosition = currentState.stackPosition;
  let undoStack: ProjectState[];
  if (currentState.stackPosition < UNDO_STACK_SIZE - 1) {
    stackPosition += 1;
    undoStack = [...currentState.undoStack];
  }
  else {
    undoStack = currentState.undoStack.slice(1);
    undoStack.push(undefined);
  }

  undoStack[stackPosition] = {
    project: paper.project.exportJSON({ asString: false }) as unknown as ExportedProject,
    addedLabels,
    removedLabels,
  };

  return {
    ...currentState,
    stackPosition,
    lastValidPosition: stackPosition,
    undoStack,
    canUndo: true,
    canRedo: false,
  };
}

// Function to handle dispatched actions
export default function undoHistory(state = getDefaultState(), action: UndoHistoryAction): UndoHistory {
  switch (action.type) {
    case ADD_STATE_TO_HISTORY: {
      return addToHistory(state);
    }
    case RESET_HISTORY: {
      return {
        ...state,
        stackPosition: 0,
        lastValidPosition: 0,
        undoStack: [{
          project: paper.project.exportJSON({ asString: false }) as unknown as ExportedProject,
          addedLabels: [],
          removedLabels: [],
        }],
        canUndo: false,
        canRedo: false,
      };
    }
    case UNDO: {
      if (!state.canUndo) return state;

      const newStackPosition = state.stackPosition - 1;
      // Undo add/remove label events at current position
      let newLabels = state.labels;
      state.undoStack[state.stackPosition].addedLabels.forEach((label) => newLabels = labels(newLabels, { type: REMOVE_LABEL, label }));
      state.undoStack[state.stackPosition].removedLabels.forEach((label) => newLabels = labels(newLabels, { type: ADD_LABEL, label }));

      // Set project state to previous
      if (state.undoStack[newStackPosition]) setProjectState(state.undoStack[newStackPosition].project);

      return {
        ...state,
        stackPosition: newStackPosition,
        canUndo: newStackPosition > 0,
        canRedo: true,
        labels: newLabels,
      };
    }
    case REDO: {
      if (!state.canRedo) return state;

      const newStackPosition = state.stackPosition + 1;
      // Reapply add/remove label events at new position
      let newLabels = state.labels;
      state.undoStack[newStackPosition].addedLabels.forEach((label) => newLabels = labels(newLabels, { type: ADD_LABEL, label }));
      state.undoStack[newStackPosition].removedLabels.forEach((label) => newLabels = labels(newLabels, { type: REMOVE_LABEL, label }));

      setProjectState(state.undoStack[newStackPosition].project);

      return {
        ...state,
        stackPosition: newStackPosition,
        canUndo: true,
        canRedo: newStackPosition < state.lastValidPosition,
        labels: newLabels
      };
    }
    case ADD_LABEL: {
      // Dispatch to labels slice
      state.labels = labels(state.labels, action);

      // Store project state
      const newState = addToHistory(state, [action.label]);

      return newState;
    }
    case REMOVE_LABEL: {
      // Dispatch to labels slice
      state.labels = labels(state.labels, action);

      // Store project state
      const newState = addToHistory(state, [], [action.label]);

      return newState;
    }
    case SET_LABELS: {
      // Adds all labels in action labels
      const addedLabels: Label[] = action.labels;
      // Removes all current labels
      const removedLabels: Label[] = state.labels.labels;

      const newState = addToHistory(state, addedLabels, removedLabels);

      // Dispatch to labels slice
      newState.labels = labels(state.labels, action);

      return newState;
    }
    case SET_ACTIVE_LABEL_TYPE: {
      return {
        ...state,
        labels: labels(state.labels, action),
      }
    }
    default:
      return state;
  }
}
