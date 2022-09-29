declare namespace OptionSliderCssNamespace {
  export interface IOptionSliderCss {
    slider: string;
    "slider-container": string;
    "slider-text": string;
    "slider-value": string;
    "slider-value-text": string;
    sliderContainer: string;
    sliderText: string;
    sliderValue: string;
    sliderValueText: string;
  }
}

declare const OptionSliderCssModule: OptionSliderCssNamespace.IOptionSliderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: OptionSliderCssNamespace.IOptionSliderCss;
};

export = OptionSliderCssModule;
