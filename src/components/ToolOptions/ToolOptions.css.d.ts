declare namespace ToolOptionsCssNamespace {
  export interface IToolOptionsCss {
    "option-container": string;
    optionContainer: string;
    "options-container": string;
    "options-text": string;
    optionsContainer: string;
    optionsText: string;
  }
}

declare const ToolOptionsCssModule: ToolOptionsCssNamespace.IToolOptionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ToolOptionsCssNamespace.IToolOptionsCss;
};

export = ToolOptionsCssModule;
