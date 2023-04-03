declare namespace StylesCssNamespace {
  export interface IStylesCss {
    "card-column-container": string;
    cardColumnContainer: string;
    "course-action-buttons": string;
    courseActionButtons: string;
    "dialog-content": string;
    dialogContent: string;
    "file-select-container": string;
    fileSelectContainer: string;
    "submissions-cell": string;
    "submissions-table": string;
    "submissions-table-body": string;
    "submissions-table-container": string;
    "submissions-table-icon": string;
    "submissions-table-row": string;
    submissionsCell: string;
    submissionsTable: string;
    submissionsTableBody: string;
    submissionsTableContainer: string;
    submissionsTableIcon: string;
    submissionsTableRow: string;
    "submit-code-button-container": string;
    submitCodeButtonContainer: string;
  }
}

declare const StylesCssModule: StylesCssNamespace.IStylesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesCssNamespace.IStylesCss;
};

export = StylesCssModule;
