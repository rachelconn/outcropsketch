import { Cursor } from "../../classes/cursors/cursors";
import { ToolOption } from "../../classes/toolOptions/toolOptions";

// Action types
export const SET_TOOL = 'SET_TOOL';
export const SET_TOOL_OPTION_VALUE = 'SET_TOOL_OPTION_VALUE';
export const SET_CURSOR = 'SET_CURSOR';

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

export type OptionsAction = (
  SetToolAction
  | SetToolOptionValueAction
  | SetCursorAction
);
