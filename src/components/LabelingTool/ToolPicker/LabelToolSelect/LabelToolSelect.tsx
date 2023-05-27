import React from 'react';
import paper from 'paper-jsdom-canvas';
import { useSelector } from 'react-redux';
import { getLabelTypeName, LabelType, NonGeologicalTypeTool, StructureTypeTool, SurfaceTypeTool } from '../../../../classes/labeling/labeling';
import { getNonGeologicalTypeColor, getNonGeologicalTypeName, NonGeologicalType } from '../../../../classes/labeling/nonGeologicalType';
import { getStructureTypeColor, getStructureTypeName, StructureType } from '../../../../classes/labeling/structureType';
import { getSurfaceTypeColor, getSurfaceTypeName, SurfaceType } from '../../../../classes/labeling/surfaceType';
import { RootState } from '../../../../redux/reducer';
import createFillLassoTool from '../../../../tools/fillLasso';
import createPencilTool from '../../../../tools/pencil';
import styles from './LabelToolSelect.css';
import LayerVisibilityToggle from './LayerVisibilityToggle/LayerVisibilityToggle';

// Label types for label type selector
const labelTypes = [
  LabelType.STRUCTURE,
  LabelType.SURFACE,
  LabelType.NONGEOLOGICAL,
];

const structureTypes: StructureType[] = [
  StructureType.STRUCTURELESS,
  StructureType.PLANAR_BEDDED,
  StructureType.CROSS_BEDDED,
  StructureType.GRADED,
  StructureType.CONTORTED,
  StructureType.UNKNOWN,
  StructureType.COVERED,
];

// Create tools for each structure type
const structureTypeTools: StructureTypeTool[] = structureTypes.map((structureType) => {
  const strokeColor = new paper.Color(getStructureTypeColor(structureType));
  const fillColor = new paper.Color(strokeColor);
  fillColor.alpha /= 2;
  const tool = createFillLassoTool({
    layer: LabelType.STRUCTURE,
    strokeColor,
    fillColor,
    label: structureType,
    labelText: getStructureTypeName(structureType),
  });

  return {
    structureType,
    tool,
  };
});

const surfaceTypes: SurfaceType[] = [
  SurfaceType.EROSION,
  SurfaceType.FRACTURE,
  SurfaceType.FAULT,
  SurfaceType.PALEOSOL,
];

// Create tools for each surface type
const surfaceTypeTools: SurfaceTypeTool[] = surfaceTypes.map((surfaceType) => {
  const strokeColor = new paper.Color(getSurfaceTypeColor(surfaceType));
  const tool = createPencilTool({
    layer: LabelType.SURFACE,
    canContinue: true,
    strokeColor,
    label: surfaceType,
    labelText: getSurfaceTypeName(surfaceType),
  });

  return {
    surfaceType,
    tool,
  };
});

const nonGeologicalTypes: NonGeologicalType[] = [
  NonGeologicalType.PERSON,
  NonGeologicalType.COMPASS,
  NonGeologicalType.HAMMER,
  NonGeologicalType.PENCIL,
  NonGeologicalType.SKY,
  NonGeologicalType.FOLIAGE,
  NonGeologicalType.MISC,
];

// create tools for each non-geological type
const nonGeologicalTypeTools: NonGeologicalTypeTool[] = nonGeologicalTypes.map((nonGeologicalType) => {
  const strokeColor = new paper.Color(getNonGeologicalTypeColor(nonGeologicalType));
  const fillColor = new paper.Color(strokeColor);
  fillColor.alpha /= 2;
  const tool = createFillLassoTool({
    layer: LabelType.NONGEOLOGICAL,
    strokeColor,
    fillColor,
    label: nonGeologicalType,
    labelText: getNonGeologicalTypeName(nonGeologicalType),
  });

  return {
    nonGeologicalType,
    tool,
  };
});

// Style to use to hide elements (ie. label types not currently selected)
// This will prevent the width from changing whenever the label type is changed
const hiddenStyle: React.CSSProperties = {
  visibility: 'hidden',
  height: 0,
};

const LabelToolSelect: React.FC = () => {
  const [activeLabelType, setActiveLabelType] = React.useState(LabelType.STRUCTURE);
  const activeTool = useSelector<RootState, paper.Tool>((state) => state.options.tool);

  // On initial render, make sure the first structure type tool is active
  React.useEffect(() => {
    structureTypeTools[0].tool.activate();
  }, []);

  const structureTypeToolButtons = structureTypeTools.map((structureTypeTool) => {
    const { tool, structureType } = structureTypeTool;
    // When button is clicked, set to the active tool
    const handleClick = () => {
      tool.activate();
    };

    const isActive = tool === activeTool;
    const style: React.CSSProperties = {
      opacity: isActive ? 1 : 0.6,
      fontWeight: isActive ? 'bold' : 'normal',
      // Display contorted label smaller when selected to prevent overflow
      fontSize: (structureType === StructureType.CONTORTED && isActive) ? '12px' : undefined,
      backgroundColor: getStructureTypeColor(structureType).toCSS(true),
    };
    const name = getStructureTypeName(structureType);
    const text = isActive ? `> ${name} <` : name;

    return (
      <div style={style} className={styles.labelToolButton} onClick={handleClick} key={structureType}>
        {text}
      </div>
    );
  });

  const surfaceTypeToolButtons = surfaceTypeTools.map((surfaceTypeTool) => {
    const { tool, surfaceType } = surfaceTypeTool;
    // When button is clicked, set to the active tool
    const handleClick = () => {
      tool.activate();
    };

    const isActive = tool === activeTool;
    const style: React.CSSProperties = {
      opacity: isActive ? 1 : 0.6,
      fontWeight: isActive ? 'bold' : 'normal',
      backgroundColor: getSurfaceTypeColor(surfaceType).toCSS(true),
    };
    const name = getSurfaceTypeName(surfaceType);
    const text = isActive ? `> ${name} <` : name;

    return (
      <div style={style} className={styles.labelToolButton} onClick={handleClick} key={surfaceType}>
        {text}
      </div>
    );
  });

  const nonGeologicalTypeToolButtons = nonGeologicalTypeTools.map((nonGeologicalTypeTool) => {
    const { tool, nonGeologicalType } = nonGeologicalTypeTool;
    // when button is clicked, set to the active tool
    const handleClick = () => {
      tool.activate();
    };

    const isActive = tool === activeTool;
    const style: React.CSSProperties = {
      opacity: isActive ? 1 : 0.6,
      fontWeight: isActive ? 700 : 'bold',
      backgroundColor: getNonGeologicalTypeColor(nonGeologicalType).toCSS(true),
      color: 'black',
    };
    const name = getNonGeologicalTypeName(nonGeologicalType);
    const text = isActive ? `> ${name} <` : name;

    return (
      <div style={style} className={styles.labelToolButton} onClick={handleClick} key={nonGeologicalType}>
        {text}
      </div>
    );
  });

  // Label type selector
  const labelTypeTabs = (
    <div className={styles.labelTypePickerContainer}>
      {labelTypes.map((labelType) => {
        const handleClick = () => {
          setActiveLabelType(labelType);
        };

        const tabClassName = `${styles.labelTypeTab}${labelType === activeLabelType ? ` ${styles.selected}` : ''}`

        return (
          <div className={tabClassName} onClick={handleClick} key={labelType}>
            {getLabelTypeName(labelType)}
            <div className={styles.labelVisibilityIcon}>
              <LayerVisibilityToggle layer={labelType} />
            </div>

          </div>
        );
      })}
    </div>
  );

  // Hide label type tools unless they are selected
  const structureTypeStyle = activeLabelType === LabelType.STRUCTURE ? undefined : hiddenStyle;
  const surfaceTypeStyle = activeLabelType === LabelType.SURFACE ? undefined : hiddenStyle;
  const nonGeologicalTypeStyle = activeLabelType === LabelType.NONGEOLOGICAL ? undefined : hiddenStyle;

  return (
    <div className={styles.labelToolSelectContainer}>
      {labelTypeTabs}
      <div style={structureTypeStyle} className={styles.toolTypeContainer}>
        {structureTypeToolButtons}
      </div>
      <div style={surfaceTypeStyle} className={styles.toolTypeContainer}>
        {surfaceTypeToolButtons}
      </div>
      <div style={nonGeologicalTypeStyle} className={styles.toolTypeContainer}>
        {nonGeologicalTypeToolButtons}
      </div>
    </div>
  );
};

export default LabelToolSelect;
