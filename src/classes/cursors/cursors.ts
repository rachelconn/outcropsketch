import EraserIcon from '../../images/icons/eraser.svg';
import PencilIcon from '../../images/icons/pencil.svg';
import ScalpelIcon from '../../images/icons/scalpel.svg';

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
