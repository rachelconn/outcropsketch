declare namespace SketchCanvasCssNamespace {
  export interface ISketchCanvasCss {
    canvas: string;
    "canvas-container": string;
    canvasContainer: string;
    "image-container": string;
    imageContainer: string;
  }
}

declare const SketchCanvasCssModule: SketchCanvasCssNamespace.ISketchCanvasCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SketchCanvasCssNamespace.ISketchCanvasCss;
};

export = SketchCanvasCssModule;
