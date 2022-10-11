declare namespace InputFieldCssNamespace {
  export interface IInputFieldCss {
    checkbox: string;
    input: string;
    "input-container": string;
    inputContainer: string;
    option: string;
    select: string;
    textarea: string;
  }
}

declare const InputFieldCssModule: InputFieldCssNamespace.IInputFieldCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InputFieldCssNamespace.IInputFieldCss;
};

export = InputFieldCssModule;
