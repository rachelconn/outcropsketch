declare namespace AddLabelDialogCssNamespace {
  export interface IAddLabelDialogCss {
    "add-button-container": string;
    addButtonContainer: string;
    "label-dialog-container": string;
    labelDialogContainer: string;
  }
}

declare const AddLabelDialogCssModule: AddLabelDialogCssNamespace.IAddLabelDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AddLabelDialogCssNamespace.IAddLabelDialogCss;
};

export = AddLabelDialogCssModule;
