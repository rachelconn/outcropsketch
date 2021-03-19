import paper from 'paper';
import * as React from 'react';
import { StructureTypeTool } from '../../classes/labeling/labeling';
import { getStructureTypeColor, getStructureTypeName, StructureType } from '../../classes/labeling/structureType';
import createFillLassoTool from '../../tools/fillLasso';
import styles from './ToolPicker.css';

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
      <div style={style} className={styles.structureTypeToolButton} onClick={handleClick}>
        {getStructureTypeName(structureType)}
      </div>
    );

  });

  return (
    <div className={styles.structureTypeToolContainer}>
      {structureTypeToolButtons}
    </div>
  )
};

export default ToolPicker;
