declare namespace ErrorAlertCssNamespace {
  export interface IErrorAlertCss {
    "close-icon-container": string;
    closeIconContainer: string;
    "error-alert-container": string;
    "error-alert-wrapper": string;
    "error-icon-container": string;
    errorAlertContainer: string;
    errorAlertWrapper: string;
    errorIconContainer: string;
  }
}

declare const ErrorAlertCssModule: ErrorAlertCssNamespace.IErrorAlertCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ErrorAlertCssNamespace.IErrorAlertCss;
};

export = ErrorAlertCssModule;
