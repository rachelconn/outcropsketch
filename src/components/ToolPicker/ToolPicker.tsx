import paper from 'paper';
import * as React from 'react';
import { getLabelTypeName, LabelType, StructureTypeTool, SurfaceTypeTool, NonGeologicalTypeTool } from '../../classes/labeling/labeling';
import { getStructureTypeColor, getStructureTypeName, StructureType } from '../../classes/labeling/structureType';
import createFillLassoTool from '../../tools/fillLasso';
import createEraserTool from '../../tools/eraser';
import styles from './ToolPicker.css';
import UtilityButton from './UtilityButton/UtilityButton';
import LoadFileButton from './LoadFileButton/LoadFileButton';
import { getSurfaceTypeColor, getSurfaceTypeName, SurfaceType } from '../../classes/labeling/surfaceType';
import loadLabelsFromFile from '../../utils/loadLabelsFromFile';
import eraserIcon from '../../images/icons/eraser.svg';
import layersIcon from '../../images/icons/layers.svg';
import saveIcon from '../../images/icons/save.svg';
import openFileIcon from '../../images/icons/open.svg';
import undoIcon from '../../images/icons/undo.svg';
import redoIcon from '../../images/icons/redo.svg';
import panIcon from '../../images/icons/pan.svg';
import imageIcon from '../../images/icons/image.svg';
import zoomInIcon from '../../images/icons/zoomIn.svg';
import zoomOutIcon from '../../images/icons/zoomOut.svg';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseImageScale, increaseImageScale } from '../../redux/actions/image';
import { setOverwrite } from '../../redux/actions/options';
import loadImage from '../../utils/loadImage';
import exportProjectToJSON from '../../utils/exportProjectToJSON';
import createPanTool from '../../tools/pan';
import createPencilTool from '../../tools/pencil';
import { NonLabelType} from '../../classes/layers/layers';
import pencilIcon from '../../images/icons/pencil.svg';
import ToggleButton from './LabelToggleButton/ToggleButton';
import { getNonGeologicalTypeColor, getNonGeologicalTypeName, NonGeologicalType } from '../../classes/labeling/nonGeologicalType';
import { RootState } from '../../redux/reducer';
import { UndoHistory } from '../../redux/reducers/undoHistory';
import { redo, undo } from '../../redux/actions/undoHistory';

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
    textOnHover: getStructureTypeName(structureType),
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
    strokeColor,
    textOnHover: getSurfaceTypeName(surfaceType),
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
    textOnHover: getNonGeologicalTypeName(nonGeologicalType),
  });

  return {
    nonGeologicalType,
    tool,
  };
});

// Pencil tool to use with pencil button
const pencilTool = createPencilTool({
  layer: NonLabelType.PENCIL
});

// Eraser tool to use with eraser button
const eraserTool = createEraserTool({ radius: 5 });

// Pan tool to use with pan button
const panTool = createPanTool();

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

const ToolPicker: React.FC = () => {
  const [activeToolIdx, setActiveToolIdx] = React.useState(0);
  const [activeLabelType, setActiveLabelType] = React.useState(LabelType.STRUCTURE);

  const dispatch = useDispatch();
  const { canUndo, canRedo } = useSelector<RootState, UndoHistory>((state) => state.undoHistory);

  // On initial render, make sure the first structure type tool is active
  React.useEffect(() => {
    structureTypeTools[0].tool.activate();
  }, []);

  let numTools = 0;

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
      <div style={style} className={styles.labelToolButton} onClick={handleClick} key={structureType}>
        {getStructureTypeName(structureType)}
      </div>
    );
  });
  numTools += structureTypeTools.length;

  const surfaceTypeToolButtons = surfaceTypeTools.map((surfaceTypeTool, idx) => {
    const toolIdx = idx + numTools;
    const { tool, surfaceType } = surfaceTypeTool;
    // When button is clicked, set to the active tool
    const handleClick = () => {
      tool.activate();
      setActiveToolIdx(toolIdx);
    };

    const style: React.CSSProperties = {
      opacity: (toolIdx === activeToolIdx) ? 1 : 0.6,
      backgroundColor: getSurfaceTypeColor(surfaceType).toCSS(true),
    };

    return (
      <div style={style} className={styles.labelToolButton} onClick={handleClick} key={surfaceType}>
        {getSurfaceTypeName(surfaceType)}
      </div>
    );
  });
  numTools += surfaceTypeTools.length;

  const nonGeologicalTypeToolButtons = nonGeologicalTypeTools.map((nonGeologicalTypeTool, idx) => {
    const toolIdx = idx + numTools;
    const { tool, nonGeologicalType } = nonGeologicalTypeTool;
    // when button is clicked, set to the active tool
    const handleClick = () => {
      tool.activate();
      setActiveToolIdx(toolIdx);
    };

    const style: React.CSSProperties = {
      opacity: (toolIdx === activeToolIdx) ? 1 : 0.6,
      backgroundColor: getNonGeologicalTypeColor(nonGeologicalType).toCSS(true),
      color: 'black',
      fontWeight: 'bold',
    };

    return (
      <div style={style} className={styles.labelToolButton} onClick={handleClick} key={nonGeologicalType}>
        {getNonGeologicalTypeName(nonGeologicalType)}
      </div>
    );
  });
  numTools += nonGeologicalTypeTools.length;

  // Label type selector
  const labelTypeTabs = (
    <div className={styles.labelTypePickerContainer}>
      {labelTypes.map((labelType) => {
        const handleClick = () => {
          setActiveLabelType(labelType);
        };

        const style: React.CSSProperties = {
          opacity: (labelType === activeLabelType) ? 1 : 0.6,
        };

        return (
          <div style={style} className={styles.labelTypeTab} onClick={handleClick} key={labelType}>
            {getLabelTypeName(labelType)}
          </div>
        );
      })}
    </div>
  );

    // pencil tool
    const PENCIL_TOOL_IDX = numTools;
    const handlePencilClick = () => {
      setActiveToolIdx(PENCIL_TOOL_IDX);
      pencilTool.activate();
    };
    const pencilActive = activeToolIdx === PENCIL_TOOL_IDX;
    const pencilToolButton = <UtilityButton label="Pencil" color="#f0c101" icon={pencilIcon} hotkey='d' onClick={handlePencilClick} active={pencilActive} />;
    numTools += 1;

  // Eraser tool
  const ERASER_TOOL_IDX = numTools;
  const handleEraserClick = () => {
    setActiveToolIdx(ERASER_TOOL_IDX);
    eraserTool.activate();
  };
  const eraserActive = activeToolIdx === ERASER_TOOL_IDX;
  const eraserToolButton = <UtilityButton label="Eraser" color="hotpink" icon={eraserIcon} hotkey='e' onClick={handleEraserClick} active={eraserActive} />;
  numTools += 1;

  // Pan tool
  const PAN_TOOL_IDX = numTools;
  const handlePanClick = () => {
    setActiveToolIdx(PAN_TOOL_IDX);
    panTool.activate();
  }
  const panToolActive = activeToolIdx === PAN_TOOL_IDX;
  const panToolButton = <UtilityButton label="Pan" color="#192861" icon={panIcon} hotkey=' ' onClick={handlePanClick} active={panToolActive} />;
  numTools += 1;

	// Toggle overwrite
	const handleOverwriteToggleClick = (overwrite: boolean) => {
		dispatch(setOverwrite(overwrite));
	};
	const overwriteToggleButton = (
		<ToggleButton
			defaultState={true}
			activeLabel="Overwrite Previous Labels"
			inactiveLabel="Draw Under Previous Labels"
			icon={layersIcon}
			color="forestgreen"
			onClick={handleOverwriteToggleClick}
		/>
	);

  // Save to json
  const saveButton = <UtilityButton label="Save Labels" icon={saveIcon} onClick={exportProjectToJSON} />

  // Load labels from a json file
  const loadLabelsButton = <LoadFileButton label="Load Labels" accept=".json" icon={openFileIcon} onFileLoad={loadLabelsFromFile} />;

  // Load a new image
  const loadImageButton = <LoadFileButton label="Load Image" accept="image/*" icon={imageIcon} onFileLoad={loadImage} />;

  // Zoom in
  const handleZoomInClick = () => { dispatch(increaseImageScale()); };
  const zoomInButton = <UtilityButton label="Zoom In" icon={zoomInIcon} hotkey='i' onClick={handleZoomInClick} />;

  // Zoom out
  const handleZoomOutClick = () => { dispatch(decreaseImageScale()); };
  const zoomOutButton = <UtilityButton label="Zoom Out" icon={zoomOutIcon} hotkey='o' onClick={handleZoomOutClick} />;

  // Undo
  const handleUndoClick = () => { dispatch(undo()); };
  const undoButton = <UtilityButton active={canUndo} label="Undo" icon={undoIcon} hotkey='z' onClick={handleUndoClick} />;

  // Redo
  const handleRedoClick = () => { dispatch(redo()); };
  const redoButton = <UtilityButton active={canRedo} label="Redo" icon={redoIcon} hotkey='x' onClick={handleRedoClick} />;

  // Hide label type tools unless they are selected
  const structureTypeStyle = activeLabelType === LabelType.STRUCTURE ? undefined : hiddenStyle;
  const surfaceTypeStyle = activeLabelType === LabelType.SURFACE ? undefined : hiddenStyle;
  const nonGeologicalTypeStyle = activeLabelType === LabelType.NONGEOLOGICAL ? undefined : hiddenStyle;

  return (
    <div className={styles.toolPickerContainer}>
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
      <div className={styles.utilityButtonContainer}>
        {pencilToolButton}
        {eraserToolButton}
        {panToolButton}
				{overwriteToggleButton}
        {saveButton}
        {loadLabelsButton}
        {loadImageButton}
        {zoomInButton}
        {zoomOutButton}
        {undoButton}
        {redoButton}
      </div>
    </div>
  )
};

export default ToolPicker;
