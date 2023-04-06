declare namespace ComparisonToolCssNamespace {
  export interface IComparisonToolCss {
    "comparison-tool-container": string;
    comparisonToolContainer: string;
  }
}

declare const ComparisonToolCssModule: ComparisonToolCssNamespace.IComparisonToolCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ComparisonToolCssNamespace.IComparisonToolCss;
};

export = ComparisonToolCssModule;
