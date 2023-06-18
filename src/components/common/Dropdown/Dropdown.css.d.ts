declare namespace DropdownCssNamespace {
  export interface IDropdownCss {
    "dialog-container": string;
    dialogContainer: string;
    "dropdown-entry": string;
    "dropdown-entry-icon": string;
    "dropdown-entry-icon-container": string;
    dropdownEntry: string;
    dropdownEntryIcon: string;
    dropdownEntryIconContainer: string;
  }
}

declare const DropdownCssModule: DropdownCssNamespace.IDropdownCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DropdownCssNamespace.IDropdownCss;
};

export = DropdownCssModule;
