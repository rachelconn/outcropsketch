declare namespace StandardPageCssNamespace {
  export interface IStandardPageCss {
    "page-container": string;
    pageContainer: string;
    root: string;
  }
}

declare const StandardPageCssModule: StandardPageCssNamespace.IStandardPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StandardPageCssNamespace.IStandardPageCss;
};

export = StandardPageCssModule;
