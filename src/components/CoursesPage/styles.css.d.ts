declare namespace StylesCssNamespace {
  export interface IStylesCss {
    "card-column-container": string;
    cardColumnContainer: string;
    "course-action-buttons": string;
    courseActionButtons: string;
    "dialog-content": string;
    dialogContent: string;
    header: string;
    "header-title": string;
    headerTitle: string;
    "submit-code-button-container": string;
    submitCodeButtonContainer: string;
  }
}

declare const StylesCssModule: StylesCssNamespace.IStylesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesCssNamespace.IStylesCss;
};

export = StylesCssModule;
