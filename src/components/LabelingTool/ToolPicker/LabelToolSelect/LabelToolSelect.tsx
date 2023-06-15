import React from 'react';
import paper from 'paper-jsdom-canvas';
import { useSelector } from 'react-redux';
import { getLabelTypeName, LabelType } from '../../../../classes/labeling/labeling';
import { RootState } from '../../../../redux/reducer';
import styles from './LabelToolSelect.css';
import LayerVisibilityToggle from './LayerVisibilityToggle/LayerVisibilityToggle';
import { Labels } from '../../../../redux/reducers/labels';


// Label types for label type selector
const labelTypes = [
  LabelType.STRUCTURE,
  LabelType.SURFACE,
  LabelType.NONGEOLOGICAL,
];

// Style to use to hide elements (ie. label types not currently selected)
// This will prevent the width from changing whenever the label type is changed
const hiddenStyle: React.CSSProperties = {
  visibility: 'hidden',
  height: 0,
};

const LabelToolSelect: React.FC = () => {
  const [activeLabelType, setActiveLabelType] = React.useState(LabelType.STRUCTURE);
  const activeTool = useSelector<RootState, paper.Tool>((state) => state.options.tool);
  const { labels, tools } = useSelector<RootState, Labels>((state) => state.labels);

  // On initial render, make sure the first tool is active
  React.useEffect(() => {
    tools.get(labels[0]).activate();
  }, []);

  const createButtonsForLabelType = (labelType: LabelType): JSX.Element[] => {
    return labels
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
