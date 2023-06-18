import React from 'react';
import paper from 'paper-jsdom-canvas';
import { useDispatch, useSelector } from 'react-redux';
import { getLabelTypeName, Label, LabelType } from '../../../../classes/labeling/labeling';
import { RootState } from '../../../../redux/reducer';
import styles from './LabelToolSelect.css';
import LayerVisibilityToggle from './LayerVisibilityToggle/LayerVisibilityToggle';
import { Labels } from '../../../../redux/reducers/labels';
import addIcon from '../../../../icons/add.svg';
import trashIcon from '../../../../icons/trash.svg';
import AddLabelDialog, { AddLabelDialogOptions } from '../AddLabelDialog/AddLabelDialog';
import { addLabel, availableLabelTypes, removeLabel, setActiveLabelType } from '../../../../redux/actions/labels';
import { StructureType } from '../../../../classes/labeling/structureType';

// Style to use to hide elements (ie. label types not currently selected)
// This will prevent the width from changing whenever the label type is changed
const hiddenStyle: React.CSSProperties = {
  visibility: 'hidden',
  height: 0,
};

const LabelToolSelect: React.FC = () => {
  const dispatch = useDispatch();
  const activeTool = useSelector<RootState, paper.Tool>((state) => state.options.tool);
  const { labels, tools, activeLabelType } = useSelector<RootState, Labels>((state) => state.undoHistory.labels);

  const [addLabelDialogOpen, setAddLabelDialogOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState(labels[0]);
  const [showDeleteButtons, setShowDeleteButtons] = React.useState(true);

  // Ensure an appropriate tool is active at all times
  React.useEffect(() => {
    if (activeTool) return;

    // No tool set, determine which one to set based on selectedLabel
    const targetTool = tools.get(selectedLabel);
    if (targetTool) targetTool.activate();
    // Tool for selected label doesn't exist, fall back to first tool if it exists
    else if (labels.length) tools.get(labels[0])?.activate();
  }, [activeTool, tools]);

  const createButtonsForLabelType = (labelType: LabelType): JSX.Element[] => {
    return labels
      .filter((label) => label.layer === labelType)
      .map((label) => {
        const tool = tools.get(label);
        const isActive = tool === activeTool;

        // When button is clicked, set to the active tool and label
        const handleClick = () => {
          setSelectedLabel(label);
          tool.activate();
        }

        // Calculate style (nongeological labels need black text to contrast better)
        // TODO: dynamic style calculation since users can choose label colors
        let style: React.CSSProperties = {
          opacity: isActive ? 1 : 0.6,
          fontWeight: isActive ? 'bold' : 'normal',
          fontSize: (label.labelText === StructureType.CONTORTED && isActive) ? '12px' : undefined,
          backgroundColor: label.color,
        };
        if (labelType === LabelType.NONGEOLOGICAL) {
          style = { ...style, color: 'black', fontWeight: 'bold' };
        }

        const text = isActive ? `> ${label.labelText} <` : label.labelText;

        const handleDeleteLabelClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          dispatch(removeLabel(label));
        };

        const deleteButton = showDeleteButtons ? (
          <img className={styles.deleteLabelTypeButton} width={24} height={24} src={trashIcon} onClick={handleDeleteLabelClick} />
        ) : null;

        return (
          <div style={style} className={styles.labelToolButton} onClick={handleClick} key={label.labelText}>
            <div className={styles.labelToolButtonText}>
              {text}
            </div>
            {deleteButton}
          </div>
        )
      });
  };

  // Label type selector
  const labelTypeTabs = (
    <div className={styles.labelTypePickerContainer}>
      {availableLabelTypes.map((labelType) => {
        const handleClick = () => {
          dispatch(setActiveLabelType(labelType));
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

  const structureTypeToolButtons = createButtonsForLabelType(LabelType.STRUCTURE);
  const surfaceTypeToolButtons = createButtonsForLabelType(LabelType.SURFACE);
  const nonGeologicalTypeToolButtons = createButtonsForLabelType(LabelType.NONGEOLOGICAL);

  // Functions for add label button
  const handleAddLabelButtonClick = () => setAddLabelDialogOpen(true);
  const handleClickOutsideDialog = () => setAddLabelDialogOpen(false);
  const handleClickAddLabelDone = (options: AddLabelDialogOptions) => {
    const labelToAdd: Label = {
      color: new paper.Color(options.color),
      layer: activeLabelType,
      labelText: options.name,
      labelType: options.name,
    };
    dispatch(addLabel(labelToAdd));

    setAddLabelDialogOpen(false);
  };

  const addLabelButton = (
    <AddLabelDialog open={addLabelDialogOpen} onClickOutside={handleClickOutsideDialog} onClickDone={handleClickAddLabelDone}>
      <div style={{ backgroundColor: 'gray' }} className={`${styles.labelToolButton} ${styles.addLabelButton}`} onClick={handleAddLabelButtonClick}>
        Add Label Type
        <img width={32} height={32} src={addIcon} />
      </div>
    </AddLabelDialog>
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
      <div className={styles.toolTypeContainer}>
        {addLabelButton}
      </div>
    </div>
  );
};

export default LabelToolSelect;
