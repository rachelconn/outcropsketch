declare namespace OptionCheckboxCssNamespace {
  export interface IOptionCheckboxCss {
    checkbox: string;
    "checkbox-container": string;
    "checkbox-text": string;
    checkboxContainer: string;
    checkboxText: string;
  }
}

declare const OptionCheckboxCssModule: OptionCheckboxCssNamespace.IOptionCheckboxCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: OptionCheckboxCssNamespace.IOptionCheckboxCss;
};

export = OptionCheckboxCssModule;
