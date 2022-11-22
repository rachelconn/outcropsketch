declare namespace StylesCssNamespace {
  export interface IStylesCss {
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

declare const StylesCssModule: StylesCssNamespace.IStylesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesCssNamespace.IStylesCss;
};

export = StylesCssModule;
