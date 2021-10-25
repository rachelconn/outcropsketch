import { Cursor } from "../../classes/cursors/cursors";
import Layer from "../../classes/layers/layers";
import { ToolOption } from "../../classes/toolOptions/toolOptions";

// Action types
export const SET_TOOL = 'SET_TOOL';
export const SET_TOOL_OPTION_VALUE = 'SET_TOOL_OPTION_VALUE';
export const SET_CURSOR = 'SET_CURSOR';
export const SET_LAYER = 'SET_LAYER';
export const SET_UNLABELED_AREA_OPACITY = 'SET_UNLABELED_AREA_OPACITY';

// Action interfaces
export interface SetToolAction {
  type: 'SET_TOOL',
  tool: paper.Tool,
  toolOptions: ToolOption[],
}

export interface SetToolOptionValueAction {
  type: 'SET_TOOL_OPTION_VALUE',
  toolOption: ToolOption,
  value: any,
}

export interface SetCursorAction {
  type: 'SET_CURSOR',
  cursor: Cursor,
}

export interface SetLayerAction {
  type: 'SET_LAYER',
  layer: Layer,
}

export interface SetUnlabeledAreaOpacityAction {
  type: 'SET_UNLABELED_AREA_OPACITY',
  opacity: number,
}

export function setTool(tool: paper.Tool, toolOptions: ToolOption[]): SetToolAction {
  return {
    type: SET_TOOL,
    tool,
    toolOptions,
  };
}

export function setToolOptionValue(toolOption: ToolOption, value: any): SetToolOptionValueAction {
  return {
    type: SET_TOOL_OPTION_VALUE,
    toolOption,
    value,
  };
}

export function setCursor(cursor: Cursor): SetCursorAction {
  return {
    type: SET_CURSOR,
    cursor,
  };
}

export function setLayer(layer: Layer): SetLayerAction {
  return {
    type: SET_LAYER,
    layer,
  };
}

export function setUnlabeledAreaOpacity(opacity: number): SetUnlabeledAreaOpacityAction {
  return {
    type: SET_UNLABELED_AREA_OPACITY,
    opacity,
  };
}

export type OptionsAction = (
  SetToolAction
  | SetToolOptionValueAction
  | SetCursorAction
  | SetLayerAction
  | SetUnlabeledAreaOpacityAction
);
