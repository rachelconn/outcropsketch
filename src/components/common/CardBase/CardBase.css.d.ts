declare namespace CardBaseCssNamespace {
  export interface ICardBaseCss {
    "course-card-buttons": string;
    "course-card-content": string;
    "course-card-image": string;
    "course-card-paper": string;
    courseCardButtons: string;
    courseCardContent: string;
    courseCardImage: string;
    courseCardPaper: string;
  }
}

declare const CardBaseCssModule: CardBaseCssNamespace.ICardBaseCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CardBaseCssNamespace.ICardBaseCss;
};

export = CardBaseCssModule;
