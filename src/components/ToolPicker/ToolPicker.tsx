import paper from 'paper';
import * as React from 'react';
import { StructureTypeTool } from '../../classes/labeling/labeling';
import { getStructureTypeColor, getStructureTypeName, StructureType } from '../../classes/labeling/structureType';
import createFillLassoTool from '../../tools/fillLasso';
import createEraserTool from '../../tools/eraser';
import styles from './ToolPicker.css';
import UtilityButton from './UtilityButton/UtilityButton';

const structureTypes: StructureType[] = [
  StructureType.STRUCTURELESS,
  StructureType.PLANAR_BEDDED,
  StructureType.CROSS_BEDDED,
  StructureType.GRADED,
  StructureType.CROSS_STRATA,
  StructureType.CONTORTED,
  StructureType.UNKNOWN,
  StructureType.COVERED,
];

// Create tools for each structure type
const structureTypeTools: StructureTypeTool[] = structureTypes.map((structureType) => {
  const strokeColor = new paper.Color(getStructureTypeColor(structureType));
  const fillColor = new paper.Color(strokeColor);
  fillColor.alpha /= 2;
  const tool = createFillLassoTool({ strokeColor, fillColor });

  return {
    structureType,
    tool,
  };
});

const eraserTool = createEraserTool({ radius: 5 });
const ERASER_TOOL_IDX = structureTypeTools.length;

const ToolPicker: React.FC = () => {
  const [activeToolIdx, setActiveToolIdx] = React.useState(0);

  // On initial render, make sure the first structure type tool is active
  React.useEffect(() => {
    structureTypeTools[0].tool.activate();
  }, []);

  const structureTypeToolButtons = structureTypeTools.map((structureTypeTool, idx) => {
    const { tool, structureType } = structureTypeTool;
    // When button is clicked, set to the active tool
    const handleClick = () => {
      tool.activate();
      setActiveToolIdx(idx);
    };

    const style: React.CSSProperties = {
      opacity: (idx === activeToolIdx) ? 1 : 0.6,
      backgroundColor: getStructureTypeColor(structureType).toCSS(true),
    };

    return (
      <div style={style} className={styles.structureTypeToolButton} onClick={handleClick} key={structureType}>
        {getStructureTypeName(structureType)}
      </div>
    );
  });

  // Eraser tool
  const handleEraserClick = () => {
    setActiveToolIdx(ERASER_TOOL_IDX);
    eraserTool.activate();
  };
  const eraserActive = activeToolIdx === ERASER_TOOL_IDX;
  const eraserToolButton = <UtilityButton color='hotpink' icon='eraser.svg' onClick={handleEraserClick} active={eraserActive} />;

  return (
    <>
      <div className={styles.structureTypeToolContainer}>
        {structureTypeToolButtons}
      </div>
      {eraserToolButton}
    </>
  )
};

export default ToolPicker;
