declare namespace TooltipCssNamespace {
  export interface ITooltipCss {
    "sublabel-text": string;
    sublabelText: string;
    tooltip: string;
    "tooltip-container": string;
    tooltipContainer: string;
  }
}

declare const TooltipCssModule: TooltipCssNamespace.ITooltipCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TooltipCssNamespace.ITooltipCss;
};

export = TooltipCssModule;
