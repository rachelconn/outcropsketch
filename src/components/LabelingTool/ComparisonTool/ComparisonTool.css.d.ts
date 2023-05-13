declare namespace ComparisonToolCssNamespace {
  export interface IComparisonToolCss {
    "accuracy-header": string;
    accuracyHeader: string;
    "comparison-tool-container": string;
    comparisonToolContainer: string;
    header: string;
    subheader: string;
  }
}

declare const ComparisonToolCssModule: ComparisonToolCssNamespace.IComparisonToolCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ComparisonToolCssNamespace.IComparisonToolCss;
};

export = ComparisonToolCssModule;
