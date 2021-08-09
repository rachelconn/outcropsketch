declare namespace ToolPickerCssNamespace {
  export interface IToolPickerCss {
    "label-tool-button": string;
    "label-type-picker-container": string;
    "label-type-tab": string;
    labelToolButton: string;
    labelTypePickerContainer: string;
    labelTypeTab: string;
    selected: string;
    "tool-picker-container": string;
    "tool-type-container": string;
    toolPickerContainer: string;
    toolTypeContainer: string;
    "utility-button-container": string;
    utilityButtonContainer: string;
  }
}

declare const ToolPickerCssModule: ToolPickerCssNamespace.IToolPickerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ToolPickerCssNamespace.IToolPickerCss;
};

export = ToolPickerCssModule;
