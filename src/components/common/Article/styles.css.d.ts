declare namespace StylesCssNamespace {
  export interface IStylesCss {
    "centered-text": string;
    centeredText: string;
    header: string;
    image: string;
    "image-caption": string;
    "image-container": string;
    imageCaption: string;
    imageContainer: string;
    "list-container": string;
    "list-item": string;
    listContainer: string;
    listItem: string;
    paragraph: string;
    "presentation-container": string;
    presentationContainer: string;
    subheader: string;
  }
}

declare const StylesCssModule: StylesCssNamespace.IStylesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesCssNamespace.IStylesCss;
};

export = StylesCssModule;
