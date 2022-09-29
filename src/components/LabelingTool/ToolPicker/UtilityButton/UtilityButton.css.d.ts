declare namespace UtilityButtonCssNamespace {
  export interface IUtilityButtonCss {
    "utility-button": string;
    "utility-button-active": string;
    utilityButton: string;
    utilityButtonActive: string;
  }
}

declare const UtilityButtonCssModule: UtilityButtonCssNamespace.IUtilityButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UtilityButtonCssNamespace.IUtilityButtonCss;
};

export = UtilityButtonCssModule;
