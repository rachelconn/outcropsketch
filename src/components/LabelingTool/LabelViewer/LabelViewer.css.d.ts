declare namespace LabelViewerCssNamespace {
  export interface ILabelViewerCss {
    canvas: string;
    "canvas-container": string;
    canvasContainer: string;
    image: string;
    "image-container": string;
    imageContainer: string;
  }
}

declare const LabelViewerCssModule: LabelViewerCssNamespace.ILabelViewerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LabelViewerCssNamespace.ILabelViewerCss;
};

export = LabelViewerCssModule;
