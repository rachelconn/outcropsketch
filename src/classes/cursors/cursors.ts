import EraserIcon from '../../images/icons/eraser.svg';
import PencilIcon from '../../images/icons/pencil.svg';
import SelectIcon from '../../images/icons/select.svg';

export enum Cursor {
  AREA_LASSO,
  ERASER,
  PENCIL,
  GRAB,
};

// CSS values for the cursor property for each Cursor value
const cursorCSSMap: Record<Cursor, string> = {
  [Cursor.AREA_LASSO]: `crosshair`,
  [Cursor.ERASER]: `url(${EraserIcon}) 0 24, crosshair`,
  [Cursor.PENCIL]: `url(${PencilIcon}) 0 24, crosshair`,
  [Cursor.GRAB]: 'grab',
};

export function cursorCSS(cursor: Cursor): string {
  return cursorCSSMap[cursor];
}
