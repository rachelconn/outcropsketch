
let TS_NODE;
if (typeof process !== 'undefined') {
  TS_NODE = process[Symbol.for("ts-node.register.instance")];
}
let EraserIcon, PencilIcon, ScalpelIcon;
if (!TS_NODE) {
  EraserIcon = require('../../icons/eraser.svg');
  PencilIcon = require('../../icons/pencil.svg');
  ScalpelIcon = require('../../icons/scalpel.svg');
}

export enum Cursor {
  AREA_LASSO,
  ERASER,
  PENCIL,
  GRAB,
  SCALPEL,
  HELP,
};

// CSS values for the cursor property for each Cursor value
const cursorCSSMap: Record<Cursor, string> = {
  [Cursor.AREA_LASSO]: `crosshair`,
  [Cursor.ERASER]: `url(${EraserIcon}) 0 24, crosshair`,
  [Cursor.PENCIL]: `url(${PencilIcon}) 3 21, crosshair`,
  [Cursor.GRAB]: 'grab',
  [Cursor.SCALPEL]: `url(${ScalpelIcon}) 2 2, crosshair`,
  [Cursor.HELP]: 'help',
};

export function cursorCSS(cursor: Cursor): string {
  return cursorCSSMap[cursor];
}
