declare namespace ContributePageCssNamespace {
  export interface IContributePageCss {
    "error-text": string;
    errorText: string;
    "form-container": string;
    "form-section-container": string;
    formContainer: string;
    formSectionContainer: string;
    "submit-button-container": string;
    submitButtonContainer: string;
  }
}

declare const ContributePageCssModule: ContributePageCssNamespace.IContributePageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ContributePageCssNamespace.IContributePageCss;
};

export = ContributePageCssModule;
