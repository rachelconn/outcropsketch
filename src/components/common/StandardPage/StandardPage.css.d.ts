declare namespace StandardPageCssNamespace {
  export interface IStandardPageCss {
    "current-page-navigation-button": string;
    currentPageNavigationButton: string;
    disclaimer: string;
    divider: string;
    footerLogo: string;
    footerLogoContainer: string;
    "page-container": string;
    "page-navigation-bar": string;
    "page-navigation-button": string;
    pageContainer: string;
    pageNavigationBar: string;
    pageNavigationButton: string;
    root: string;
    title: string;
  }
}

declare const StandardPageCssModule: StandardPageCssNamespace.IStandardPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StandardPageCssNamespace.IStandardPageCss;
};

export = StandardPageCssModule;
