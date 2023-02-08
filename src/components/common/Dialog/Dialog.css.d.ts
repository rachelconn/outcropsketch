declare namespace DialogCssNamespace {
  export interface IDialogCss {
    "dialog-background": string;
    "dialog-hidden": string;
    dialogBackground: string;
    dialogHidden: string;
    paper: string;
  }
}

declare const DialogCssModule: DialogCssNamespace.IDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DialogCssNamespace.IDialogCss;
};

export = DialogCssModule;
