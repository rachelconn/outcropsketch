declare namespace LayerOptionsCssNamespace {
  export interface ILayerOptionsCss {
    "layer-options-container": string;
    layerOptionsContainer: string;
  }
}

declare const LayerOptionsCssModule: LayerOptionsCssNamespace.ILayerOptionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LayerOptionsCssNamespace.ILayerOptionsCss;
};

export = LayerOptionsCssModule;
