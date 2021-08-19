import * as React from 'react';
import createEraserTool from '../../tools/eraser';
import styles from './ToolPicker.css';
import UtilityButton from './UtilityButton/UtilityButton';
import LoadFileButton from './LoadFileButton/LoadFileButton';
import loadLabelsFromFile from '../../utils/loadLabelsFromFile';
import eraserIcon from '../../images/icons/eraser.svg';
import saveIcon from '../../images/icons/save.svg';
import areaEraserIcon from '../../images/icons/scissors.svg';
import sliceIcon from '../../images/icons/scalpel.svg';
import openFileIcon from '../../images/icons/open.svg';
import undoIcon from '../../images/icons/undo.svg';
import redoIcon from '../../images/icons/redo.svg';
import panIcon from '../../images/icons/pan.svg';
import imageIcon from '../../images/icons/image.svg';
import visibilityIcon from '../../images/icons/visibility.svg';
import zoomInIcon from '../../images/icons/zoomIn.svg';
import zoomOutIcon from '../../images/icons/zoomOut.svg';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseImageScale, increaseImageScale } from '../../redux/actions/image';
import loadImage from '../../utils/loadImage';
import exportProjectToJSON from '../../utils/exportProjectToJSON';
import createPanTool from '../../tools/pan';
import createPencilTool from '../../tools/pencil';
import { NonLabelType} from '../../classes/layers/layers';
import pencilIcon from '../../images/icons/pencil.svg';
import { RootState } from '../../redux/reducer';
import { UndoHistory } from '../../redux/reducers/undoHistory';
import { redo, undo } from '../../redux/actions/undoHistory';
import createAreaEraserTool from '../../tools/areaEraser';
import createSliceTool from '../../tools/slice';
import createLabelViewerTool from '../../tools/labelViewer';

// Tools that can be activated by buttons
const areaEraserTool = createAreaEraserTool();
const sliceTool = createSliceTool();
const pencilTool = createPencilTool({
  layer: NonLabelType.PENCIL,
  canContinue: false,
});
const eraserTool = createEraserTool();
const panTool = createPanTool();
const labelViewerTool = createLabelViewerTool();

const ToolPicker: React.FC = () => {
  const dispatch = useDispatch();
  const { canUndo, canRedo } = useSelector<RootState, UndoHistory>((state) => state.undoHistory);
  const activeTool = useSelector<RootState, paper.Tool>((state) => state.options.tool);

  // Area eraser tool
  const handleAreaEraserClick = () => {
    areaEraserTool.activate();
  }
  const areaEraserActive = activeTool === areaEraserTool;
  const areaEraserToolButton = <UtilityButton label="Area Eraser" color="c00000" icon={areaEraserIcon} hotkey='a' onClick={handleAreaEraserClick} active={areaEraserActive} />;

  // Slice tool
  const handleSliceClick = () => {
    sliceTool.activate();
  }
  const sliceActive = activeTool === sliceTool;
  const sliceToolButton = <UtilityButton label="Slice Shape" color="2020ff" icon={sliceIcon} hotkey='s' onClick={handleSliceClick} active={sliceActive} />;

  // Pencil tool
  const handlePencilClick = () => {
    pencilTool.activate();
  };
  const pencilActive = activeTool === pencilTool;
  const pencilToolButton = <UtilityButton label="Pencil" color="#f0c101" icon={pencilIcon} hotkey='d' onClick={handlePencilClick} active={pencilActive} />;

  // Eraser tool
  const handleEraserClick = () => {
    eraserTool.activate();
  };
  const eraserActive = activeTool === eraserTool;
  const eraserToolButton = <UtilityButton label="Eraser" color="hotpink" icon={eraserIcon} hotkey='e' onClick={handleEraserClick} active={eraserActive} />;

  // Pan tool
  const handlePanClick = () => {
    panTool.activate();
  }
  const panToolActive = activeTool === panTool;
  const panToolButton = <UtilityButton label="Pan" color="#192861" icon={panIcon} hotkey=' ' onClick={handlePanClick} active={panToolActive} />;

  // Label viewer
  const handleLabelViewerClick = () => {
    labelViewerTool.activate();
  };
  const labelViewerToolActive = activeTool === labelViewerTool;
  const labelViewerToolButton = <UtilityButton label="View labels" color="3cd184" icon={visibilityIcon} hotkey='q' onClick={handleLabelViewerClick} active={labelViewerToolActive} />;

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

  return (
    <div className={styles.utilityButtonContainer}>
      {sliceToolButton}
      {pencilToolButton}
      {eraserToolButton}
      {areaEraserToolButton}
      {panToolButton}
      {labelViewerToolButton}
      {saveButton}
      {loadLabelsButton}
      {loadImageButton}
      {zoomInButton}
      {zoomOutButton}
      {undoButton}
      {redoButton}
    </div>
  )
};

export default ToolPicker;
