declare namespace ToolOptionsCssNamespace {
  export interface IToolOptionsCss {
    checkbox: string;
    "checkbox-container": string;
    "checkbox-text": string;
    checkboxContainer: string;
    checkboxText: string;
    "option-container": string;
    optionContainer: string;
    "options-container": string;
    "options-text": string;
    optionsContainer: string;
    optionsText: string;
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

declare const ToolOptionsCssModule: ToolOptionsCssNamespace.IToolOptionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ToolOptionsCssNamespace.IToolOptionsCss;
};

export = ToolOptionsCssModule;
