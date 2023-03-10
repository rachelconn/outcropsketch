declare namespace ToolPickerCssNamespace {
  export interface IToolPickerCss {
    "tool-picker-container": string;
    toolPickerContainer: string;
    "utility-button-container": string;
    utilityButtonContainer: string;
  }
}

declare const ToolPickerCssModule: ToolPickerCssNamespace.IToolPickerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ToolPickerCssNamespace.IToolPickerCss;
};

export = ToolPickerCssModule;
