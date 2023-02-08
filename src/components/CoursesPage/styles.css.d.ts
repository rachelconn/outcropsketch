declare namespace StylesCssNamespace {
  export interface IStylesCss {
    "course-action-buttons": string;
    "course-card-container": string;
    "course-card-paper": string;
    courseActionButtons: string;
    courseCardContainer: string;
    courseCardPaper: string;
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
