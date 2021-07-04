import { ToolOption } from "../../classes/toolOptions/toolOptions";

// Action types
export const SET_TOOL_OPTIONS = 'SET_TOOL_OPTIONS';
export const SET_TOOL_OPTION_VALUE = 'SET_TOOL_OPTION_VALUE';

// Action interfaces
export interface SetToolOptionsAction {
  type: 'SET_TOOL_OPTIONS',
  toolOptions: ToolOption[],
}

export interface SetToolOptionValueAction {
  type: 'SET_TOOL_OPTION_VALUE',
  toolOption: ToolOption,
  value: any,
}

export function setToolOptions(toolOptions: ToolOption[]): SetToolOptionsAction {
  return {
    type: SET_TOOL_OPTIONS,
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

export type OptionsAction = (
  SetToolOptionsAction
  | SetToolOptionValueAction
);
