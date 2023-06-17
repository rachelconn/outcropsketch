declare namespace ColorPickerCssNamespace {
  export interface IColorPickerCss {
    "color-box": string;
    colorBox: string;
    container: string;
    popper: string;
  }
}

declare const ColorPickerCssModule: ColorPickerCssNamespace.IColorPickerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColorPickerCssNamespace.IColorPickerCss;
};

export = ColorPickerCssModule;
