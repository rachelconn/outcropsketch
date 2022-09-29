declare namespace TypographyCssNamespace {
  export interface ITypographyCss {
    body1: string;
    body2: string;
    button: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    subtitle: string;
    "typography-base": string;
    typographyBase: string;
  }
}

declare const TypographyCssModule: TypographyCssNamespace.ITypographyCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TypographyCssNamespace.ITypographyCss;
};

export = TypographyCssModule;
