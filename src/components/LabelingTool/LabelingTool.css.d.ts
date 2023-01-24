declare namespace LabelingToolCssNamespace {
  export interface ILabelingToolCss {
    "labeling-tool-container": string;
    labelingToolContainer: string;
    "side-padding": string;
    sidePadding: string;
    toolbox: string;
    "top-padding": string;
    topPadding: string;
  }
}

declare const LabelingToolCssModule: LabelingToolCssNamespace.ILabelingToolCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LabelingToolCssNamespace.ILabelingToolCss;
};

export = LabelingToolCssModule;
