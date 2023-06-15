import React from 'react';
import paper from 'paper-jsdom-canvas';
import { useSelector } from 'react-redux';
import { getLabelTypeName, Label, LabelType, NonGeologicalTypeTool, StructureTypeTool, SurfaceTypeTool } from '../../../../classes/labeling/labeling';
import { getNonGeologicalTypeColor, getNonGeologicalTypeName, NonGeologicalType } from '../../../../classes/labeling/nonGeologicalType';
import { getStructureTypeColor, getStructureTypeName, StructureType } from '../../../../classes/labeling/structureType';
import { getSurfaceTypeColor, getSurfaceTypeName, SurfaceType } from '../../../../classes/labeling/surfaceType';
import { RootState } from '../../../../redux/reducer';
import createFillLassoTool from '../../../../tools/fillLasso';
import createPencilTool from '../../../../tools/pencil';
import styles from './LabelToolSelect.css';
import LayerVisibilityToggle from './LayerVisibilityToggle/LayerVisibilityToggle';

const defaultLabels: Label[] = [
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.STRUCTURELESS),
    labelType: StructureType.STRUCTURELESS,
    labelText: getStructureTypeName(StructureType.STRUCTURELESS),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.PLANAR_BEDDED),
    labelType: StructureType.PLANAR_BEDDED,
    labelText: getStructureTypeName(StructureType.PLANAR_BEDDED),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.CROSS_BEDDED),
    labelType: StructureType.CROSS_BEDDED,
    labelText: getStructureTypeName(StructureType.CROSS_BEDDED),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.GRADED),
    labelType: StructureType.GRADED,
    labelText: getStructureTypeName(StructureType.GRADED),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.CONTORTED),
    labelType: StructureType.CONTORTED,
    labelText: getStructureTypeName(StructureType.CONTORTED),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.UNKNOWN),
    labelType: StructureType.UNKNOWN,
    labelText: getStructureTypeName(StructureType.UNKNOWN),
  },
  {
    layer: LabelType.STRUCTURE,
    color: getStructureTypeColor(StructureType.COVERED),
    labelType: StructureType.COVERED,
    labelText: getStructureTypeName(StructureType.COVERED),
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.EROSION),
    labelType: SurfaceType.EROSION,
    labelText: getSurfaceTypeName(SurfaceType.EROSION),
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.FRACTURE),
    labelType: SurfaceType.FRACTURE,
    labelText: getSurfaceTypeName(SurfaceType.FRACTURE),
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.FAULT),
    labelType: SurfaceType.FAULT,
    labelText: getSurfaceTypeName(SurfaceType.FAULT),
  },
  {
    layer: LabelType.SURFACE,
    color: getSurfaceTypeColor(SurfaceType.PALEOSOL),
    labelType: SurfaceType.PALEOSOL,
    labelText: getSurfaceTypeName(SurfaceType.PALEOSOL),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.PERSON),
    labelType: NonGeologicalType.PERSON,
    labelText: getNonGeologicalTypeName(NonGeologicalType.PERSON),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.COMPASS),
    labelType: NonGeologicalType.COMPASS,
    labelText: getNonGeologicalTypeName(NonGeologicalType.COMPASS),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.HAMMER),
    labelType: NonGeologicalType.HAMMER,
    labelText: getNonGeologicalTypeName(NonGeologicalType.HAMMER),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.PENCIL),
    labelType: NonGeologicalType.PENCIL,
    labelText: getNonGeologicalTypeName(NonGeologicalType.PENCIL),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.SKY),
    labelType: NonGeologicalType.SKY,
    labelText: getNonGeologicalTypeName(NonGeologicalType.SKY),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.FOLIAGE),
    labelType: NonGeologicalType.FOLIAGE,
    labelText: getNonGeologicalTypeName(NonGeologicalType.FOLIAGE),
  },
  {
    layer: LabelType.NONGEOLOGICAL,
    color: getNonGeologicalTypeColor(NonGeologicalType.MISC),
    labelType: NonGeologicalType.MISC,
    labelText: getNonGeologicalTypeName(NonGeologicalType.MISC),
  },
];

// TODO: set this some other way once adding custom types
const labelsToUse = defaultLabels;

// Label types for label type selector
const labelTypes = [
  LabelType.STRUCTURE,
  LabelType.SURFACE,
  LabelType.NONGEOLOGICAL,
];

// tools: map from labelText to tool
// TODO: use redux instead to control this map
const tools = new Map<Label, paper.Tool>();
labelsToUse.forEach((label) => {
  const fillColor = new paper.Color(label.color);
  fillColor.alpha /= 2;
  const tool = label.layer === LabelType.SURFACE ? createPencilTool({
    layer: LabelType.SURFACE,
    canContinue: true,
    strokeColor: label.color,
    label: label.labelType,
    labelText: label.labelText,
  }) : createFillLassoTool({
    layer: label.layer,
    strokeColor: label.color,
    fillColor,
    label: label.labelType,
    labelText: label.labelText,
  });

  tools.set(label, tool);
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
    tools.get(labelsToUse[0]).activate();
  }, []);

  const createButtonsForLabelType = (labelType: LabelType): JSX.Element[] => {
    return labelsToUse
      .filter((label) => label.layer === labelType)
      .map((label) => {
        const tool = tools.get(label);
        const isActive = tool === activeTool;

        // When button is clicked, set to the active tool
        const handleClick = () => tool.activate();

        // Calculate style (nongeological labels need black text to contrast better)
        // TODO: dynamic style calculation since users can choose label colors
        let style: React.CSSProperties = {
          opacity: isActive ? 1 : 0.6,
          fontWeight: isActive ? 'bold' : 'normal',
          fontSize: (label.labelText === StructureType.CONTORTED && isActive) ? '12px' : undefined,
          backgroundColor: label.color.toCSS(true),
        };
        if (labelType === LabelType.NONGEOLOGICAL) {
          style = { ...style, color: 'black', fontWeight: 'bold' };
        }

        const text = isActive ? `> ${label.labelText} <` : label.labelText;

        return (
          <div style={style} className={styles.labelToolButton} onClick={handleClick} key={label.labelText}>
            {text}
          </div>
        )
      });
  };

  const structureTypeToolButtons = createButtonsForLabelType(LabelType.STRUCTURE);
  const surfaceTypeToolButtons = createButtonsForLabelType(LabelType.SURFACE);
  const nonGeologicalTypeToolButtons = createButtonsForLabelType(LabelType.NONGEOLOGICAL);

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
