import Color from 'color';
import React from 'react';
import paper from 'paper-jsdom-canvas';
import { useDispatch, useSelector } from 'react-redux';
import { getLabelTypeName, Label, LabelType } from '../../../../classes/labeling/labeling';
import { RootState } from '../../../../redux/reducer';
import styles from './LabelToolSelect.css';
import LayerVisibilityToggle from './LayerVisibilityToggle/LayerVisibilityToggle';
import { Labels, defaultLabels } from '../../../../redux/reducers/labels';
import addIcon from '../../../../icons/add.svg';
import closeIcon from '../../../../icons/close.svg';
import exportIcon from '../../../../icons/export.svg';
import importIcon from '../../../../icons/import.svg';
import settingsIcon from '../../../../icons/settings.svg';
import resetIcon from '../../../../icons/reset.svg';
import trashIcon from '../../../../icons/trash.svg';
import AddLabelDialog, { AddLabelDialogOptions } from '../AddLabelDialog/AddLabelDialog';
import { addLabel, availableLabelTypes, getLayerForLabelType, removeLabel, setActiveLabelType, setLabels } from '../../../../redux/actions/labels';
import { StructureType } from '../../../../classes/labeling/structureType';
import Dropdown, { DropdownEntry } from '../../../common/Dropdown/Dropdown';
import ErrorAlert from '../../../common/ErrorAlert/ErrorAlert';
import { loadLabelTypesFromFile, saveLabelTypes } from '../../../../utils/labelTypes';

// Style to use to hide elements (ie. label types not currently selected)
// This will prevent the width from changing whenever the label type is changed
const hiddenStyle: React.CSSProperties = {
  visibility: 'hidden',
  height: 0,
};

interface LabelToolSelectProps {
  allowEditingLabelTypes: boolean,
}

const LabelToolSelect: React.FC<LabelToolSelectProps> = ({ allowEditingLabelTypes }) => {
  const dispatch = useDispatch();
  const activeTool = useSelector<RootState, paper.Tool>((state) => state.options.tool);
  const { labels, tools, activeLabelType } = useSelector<RootState, Labels>((state) => state.undoHistory.labels);

  const [addLabelDialogOpen, setAddLabelDialogOpen] = React.useState(false);
  const [manageLabelsDropdownOpen, setManageLabelsDropdownOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState(labels[0]);
  const [showDeleteButtons, setShowDeleteButtons] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');

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
      .filter((label) => label.labelType === labelType)
      .map((label) => {
        const tool = tools.get(label);
        const isActive = tool === activeTool;

        // When button is clicked, set to the active tool and label
        const handleClick = () => {
          setSelectedLabel(label);
          tool.activate();
        }

        // Dynamically calculate style
        let displayColor = new Color(label.color);
        if (!isActive) displayColor = displayColor.fade(0.4);
        const style: React.CSSProperties = {
          fontSize: (label.labelText === StructureType.CONTORTED && isActive) ? '12px' : undefined,
          backgroundColor: displayColor.string(),
          fontWeight: isActive ? 'bold' : 'normal',
          color: displayColor.isDark() ? '#eee' : 'black',
        };

        const text = isActive ? `> ${label.labelText} <` : label.labelText;

        const handleDeleteLabelClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          dispatch(removeLabel(label));
          setShowDeleteButtons(false);
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
            {/* <div className={styles.labelVisibilityIcon}>
              <LayerVisibilityToggle layer={getLayerForLabelType(labelType)} />
            </div> */}
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
  const handleClickOutsideAddLabel = () => setAddLabelDialogOpen(false);
  const handleClickAddLabelDone = (options: AddLabelDialogOptions) => {
    const labelToAdd: Label = {
      color: options.color,
      layer: getLayerForLabelType(activeLabelType),
      label: options.name,
      labelText: options.name,
      labelType: activeLabelType,
    };
    try {
      dispatch(addLabel(labelToAdd));
      setAddLabelDialogOpen(false);
    }
    catch (e: unknown) {
      if (e instanceof Error) setErrorText(e.message);
    }
  };

  // Config for manage labels button
  const handleDeleteLabelClick = () => {
    setManageLabelsDropdownOpen(false);
    setShowDeleteButtons(!showDeleteButtons);
  };
  const handleResetLabelsClick = () => {
    setManageLabelsDropdownOpen(false);
    dispatch(setLabels(defaultLabels));
  };
  const manageLabelsDropdownEntries: DropdownEntry[] = [
    {
      name: showDeleteButtons ? 'Cancel Deleting Label' : 'Delete Label...',
      icon: showDeleteButtons ? closeIcon : trashIcon,
      onClick: handleDeleteLabelClick,
    },
    {
      name: 'Import Labels',
      icon: importIcon,
      onClick: () => {
        setManageLabelsDropdownOpen(false);
        loadLabelTypesFromFile();
      },
    },
    {
      name: 'Reset Labels to Default',
      icon: resetIcon,
      onClick: handleResetLabelsClick,
    },
    {
      name: 'Export Labels',
      icon: exportIcon,
      onClick: () => {
        setManageLabelsDropdownOpen(false);
        saveLabelTypes();
      },
    }
  ];
  const handleClickOutsideManageLabels = () => setManageLabelsDropdownOpen(false);
  const handleManageLabelsButtonClick = () => setManageLabelsDropdownOpen(true);

  const manageLabelsButton = allowEditingLabelTypes ? (
    <div className={styles.manageLabelsContainer}>
      <div className={styles.addLabelButtonContainer}>
        <AddLabelDialog open={addLabelDialogOpen} onClickOutside={handleClickOutsideAddLabel} onClickDone={handleClickAddLabelDone}>
          <div className={`${styles.labelToolButton} ${styles.addLabelButton}`} onClick={handleAddLabelButtonClick}>
            Add Label Type
            <img width={32} height={32} src={addIcon} />
          </div>
        </AddLabelDialog>
      </div>
      <Dropdown className={styles.manageLabelsButton} open={manageLabelsDropdownOpen} entries={manageLabelsDropdownEntries} onClickOutside={handleClickOutsideManageLabels} >
        <img width={32} height={32} src={settingsIcon} onClick={handleManageLabelsButtonClick} />
      </Dropdown>
    </div>
  ) : undefined;

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
        {manageLabelsButton}
      </div>
      <ErrorAlert errorText={errorText} onDismiss={() => setErrorText('')} />
    </div>
  );
};

export default LabelToolSelect;
