declare namespace StylesCssNamespace {
  export interface IStylesCss {
    "course-action-buttons": string;
    courseActionButtons: string;
    header: string;
    "header-title": string;
    headerTitle: string;
  }
}

declare const StylesCssModule: StylesCssNamespace.IStylesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesCssNamespace.IStylesCss;
};

export = StylesCssModule;
