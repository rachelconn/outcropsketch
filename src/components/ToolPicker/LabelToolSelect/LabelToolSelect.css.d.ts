declare namespace LabelToolSelectCssNamespace {
  export interface ILabelToolSelectCss {
    "label-tool-button": string;
    "label-tool-select-container": string;
    "label-type-picker-container": string;
    "label-type-tab": string;
    labelToolButton: string;
    labelToolSelectContainer: string;
    labelTypePickerContainer: string;
    labelTypeTab: string;
    selected: string;
    "tool-type-container": string;
    toolTypeContainer: string;
  }
}

declare const LabelToolSelectCssModule: LabelToolSelectCssNamespace.ILabelToolSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LabelToolSelectCssNamespace.ILabelToolSelectCss;
};

export = LabelToolSelectCssModule;
