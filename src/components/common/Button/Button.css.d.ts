declare namespace ButtonCssNamespace {
  export interface IButtonCss {
    button: string;
    "file-select-container": string;
    "file-select-input": string;
    "file-select-input-container": string;
    fileSelectContainer: string;
    fileSelectInput: string;
    fileSelectInputContainer: string;
    icon: string;
  }
}

declare const ButtonCssModule: ButtonCssNamespace.IButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ButtonCssNamespace.IButtonCss;
};

export = ButtonCssModule;
