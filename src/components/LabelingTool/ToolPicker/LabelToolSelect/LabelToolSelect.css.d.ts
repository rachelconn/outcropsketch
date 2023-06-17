declare namespace LabelToolSelectCssNamespace {
  export interface ILabelToolSelectCss {
    "add-label-button": string;
    addLabelButton: string;
    "delete-label-type-button": string;
    deleteLabelTypeButton: string;
    "label-tool-button": string;
    "label-tool-select-container": string;
    "label-type-picker-container": string;
    "label-type-tab": string;
    "label-visibility-icon": string;
    labelToolButton: string;
    labelToolSelectContainer: string;
    labelTypePickerContainer: string;
    labelTypeTab: string;
    labelVisibilityIcon: string;
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
