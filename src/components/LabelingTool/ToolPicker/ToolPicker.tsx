import * as React from 'react';
import paper from 'paper-jsdom-canvas';
import createEraserTool from '../../../tools/eraser';
import styles from './ToolPicker.css';
import UtilityButton from './UtilityButton/UtilityButton';
import LoadFileButton from './LoadFileButton/LoadFileButton';
import loadLabelsFromFile from '../../../utils/loadLabelsFromFile';
import eraserIcon from '../../../images/icons/eraser.svg';
import saveIcon from '../../../images/icons/save.svg';
import gridIcon from '../../../images/icons/grid.svg';
import questionMarkIcon from '../../../images/icons/questionmark.svg';
import areaEraserIcon from '../../../images/icons/scissors.svg';
import sliceIcon from '../../../images/icons/scalpel.svg';
import unlabeledIcon from '../../../images/icons/unlabeled.svg';
import openJSONIcon from '../../../images/icons/openJSON.svg';
import undoIcon from '../../../images/icons/undo.svg';
import redoIcon from '../../../images/icons/redo.svg';
import panIcon from '../../../images/icons/pan.svg';
import imageIcon from '../../../images/icons/image.svg';
import visibilityIcon from '../../../images/icons/visibility.svg';
import zoomInIcon from '../../../images/icons/zoomIn.svg';
import zoomOutIcon from '../../../images/icons/zoomOut.svg';
import pencilIcon from '../../../images/icons/pencil.svg';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseImageScale, increaseImageScale } from '../../../redux/actions/image';
import loadImage from '../../../utils/loadImage';
import exportProjectToJSON from '../../../utils/exportProjectToJSON';
import createPanTool from '../../../tools/pan';
import createPencilTool from '../../../tools/pencil';
import { NonLabelType} from '../../../classes/layers/layers';
import { RootState } from '../../../redux/reducer';
import { UndoHistory } from '../../../redux/reducers/undoHistory';
import { redo, undo } from '../../../redux/actions/undoHistory';
import createAreaEraserTool from '../../../tools/areaEraser';
import createSliceTool from '../../../tools/slice';
import createLabelViewerTool from '../../../tools/labelViewer';
import { downloadMaskFile } from '../../../utils/projectToMask';
import createFillLassoTool from '../../../tools/fillLasso';
import { getNonGeologicalTypeColor, getNonGeologicalTypeName, NonGeologicalType } from '../../../classes/labeling/nonGeologicalType';
import { LabelType } from '../../../classes/labeling/labeling';
import ToggleButton from './LabelToggleButton/ToggleButton';
import { setUnlabeledAreaOpacity } from '../../../redux/actions/options';

// Tools that can be activated by buttons
const areaEraserTool = createAreaEraserTool();
const sliceTool = createSliceTool();
const pencilTool = createPencilTool({
  layer: NonLabelType.PENCIL,
  canContinue: false,
});

const unsureLabelStrokeColor = new paper.Color(getNonGeologicalTypeColor(NonGeologicalType.UNSURE));
const unsureLabelFillColor = new paper.Color(unsureLabelStrokeColor);
unsureLabelFillColor.alpha /= 2;
const unsureLabelTool = createFillLassoTool({
  layer: LabelType.NONGEOLOGICAL,
  strokeColor: unsureLabelStrokeColor,
  fillColor: unsureLabelFillColor,
  label: NonGeologicalType.UNSURE,
  labelText: getNonGeologicalTypeName(NonGeologicalType.UNSURE),
});

const eraserTool = createEraserTool();
const panTool = createPanTool();
const labelViewerTool = createLabelViewerTool();

const ToolPicker: React.FC = () => {
  const dispatch = useDispatch();
  const { canUndo, canRedo } = useSelector<RootState, UndoHistory>((state) => state.undoHistory);
  const activeTool = useSelector<RootState, paper.Tool>((state) => state.options.tool);

  // Unsure label tool
  const handleUnsureLabelToolClick = () => {
    unsureLabelTool.activate();
  }
  const unsureLabelToolActive = activeTool === unsureLabelTool;
  const unsureLabelToolButton = (
    <UtilityButton
      label="Label Unsure Area"
      sublabel="Labels that you aren't sure what label should be placed in this area."
      color="#ff0000"
      icon={questionMarkIcon}
      hotkey='u'
      onClick={handleUnsureLabelToolClick}
      active={unsureLabelToolActive}
    />
  );

  // Area eraser tool
  const handleAreaEraserClick = () => {
    areaEraserTool.activate();
  }
  const areaEraserActive = activeTool === areaEraserTool;
  const areaEraserToolButton = (
    <UtilityButton
      label="Area Eraser"
      sublabel="Drawing a shape erases labels under that shape. Note that this cannot be used to create holes in paths: try using the slice tool on it first if this is what you want to do."
      color="#c00000"
      icon={areaEraserIcon}
      hotkey='a'
      onClick={handleAreaEraserClick}
      active={areaEraserActive}
    />
  );

  // Slice tool
  const handleSliceClick = () => {
    sliceTool.activate();
  }
  const sliceActive = activeTool === sliceTool;
  const sliceToolButton = (
    <UtilityButton
      label="Slice Shape"
      sublabel="Splits shapes into multiple parts by drawing a line through them."
      color="#2020ff"
      icon={sliceIcon}
      hotkey='s'
      onClick={handleSliceClick}
      active={sliceActive}
    />
  );

  // Pencil tool
  const handlePencilClick = () => {
    pencilTool.activate();
  };
  const pencilActive = activeTool === pencilTool;
  const pencilToolButton = (
    <UtilityButton
      label="Pencil"
      sublabel="Makes markings on the image that don't count as labels."
      color="#f0c101"
      icon={pencilIcon}
      hotkey='d'
      onClick={handlePencilClick}
      active={pencilActive}
    />
  );

  // Eraser tool
  const handleEraserClick = () => {
    eraserTool.activate();
  };
  const eraserActive = activeTool === eraserTool;
  const eraserToolButton = (
    <UtilityButton
      label="Eraser"
      sublabel="Erases annotations under the mouse while it is held down."
      color="hotpink"
      icon={eraserIcon}
      hotkey='e'
      onClick={handleEraserClick}
      active={eraserActive}
    />
  );

  // Pan tool
  const handlePanClick = () => {
    panTool.activate();
  }
  const panToolActive = activeTool === panTool;
  const panToolButton = (
    <UtilityButton
      label="Pan"
      sublabel="Drag the mouse over the image to move it around without using the scroll bars."
      color="#192861"
      icon={panIcon}
      hotkey=' '
      onClick={handlePanClick}
      active={panToolActive}
    />
  );

  // Label viewer
  const handleLabelViewerClick = () => {
    labelViewerTool.activate();
  };
  const labelViewerToolActive = activeTool === labelViewerTool;
  const labelViewerToolButton = (
    <UtilityButton
      label="View labels"
      sublabel="Hovering over drawn labels allows you to see what label they correspond to."
      color="#3cd184"
      icon={visibilityIcon}
      hotkey='q'
      onClick={handleLabelViewerClick}
      active={labelViewerToolActive}
    />
  );

  // Show unlabeled areas
  const showUnlabeledAreasButton = (
    <ToggleButton
      defaultState={false}
      inactiveLabel="Show Unlabeled Areas"
      activeLabel="Hide Unlabeled Areas"
      sublabel="Displays areas that haven't been labeled yet in magenta."
      color="#ff00ff"
      hotkey="w"
      icon={unlabeledIcon}
      onClick={(active) => dispatch(setUnlabeledAreaOpacity(active ? 1 : 0))}
    />
  );

  // Save to json
  const saveButton = (
    <UtilityButton
      label="Save Labels"
      sublabel="Saves the image along with all placed annotations to a file so it can be shared with others."
      icon={saveIcon}
      onClick={exportProjectToJSON}
    />
  );

  // Save mask
  const saveMaskButton = (
    <UtilityButton
      label="Save Mask"
      icon={gridIcon}
      onClick={downloadMaskFile}
    />
  );

  // Load labels from a json file
  const loadLabelsButton = (
    <LoadFileButton
      label="Load Labels"
      sublabel="Loads a .json file containing an annotated image."
      accept=".json"
      icon={openJSONIcon}
      onFileLoad={loadLabelsFromFile}
    />
  );

  // Load a new image
  const loadImageButton = (
    <LoadFileButton
      label="Load Image"
      sublabel="Loads a new image from your computer and clears all annotations."
      accept="image/*"
      icon={imageIcon}
      onFileLoad={loadImage}
    />
  );

  // Zoom in
  const handleZoomInClick = () => { dispatch(increaseImageScale()); };
  const zoomInButton = (
    <UtilityButton
      label="Zoom In"
      icon={zoomInIcon}
      hotkey='i'
      onClick={handleZoomInClick}
    />
  );

  // Zoom out
  const handleZoomOutClick = () => { dispatch(decreaseImageScale()); };
  const zoomOutButton = (
    <UtilityButton
      label="Zoom Out"
      icon={zoomOutIcon}
      hotkey='o'
      onClick={handleZoomOutClick}
    />
  );

  // Undo
  const handleUndoClick = () => { dispatch(undo()); };
  const undoButton = (
    <UtilityButton
      active={canUndo}
      label="Undo"
      icon={undoIcon}
      hotkey='z'
      onClick={handleUndoClick}
    />
  );

  // Redo
  const handleRedoClick = () => { dispatch(redo()); };
  const redoButton = (
    <UtilityButton
      active={canRedo}
      label="Redo"
      icon={redoIcon}
      hotkey='x'
      onClick={handleRedoClick}
    />
  );

  return (
    <div className={styles.utilityButtonContainer}>
      {unsureLabelToolButton}
      {sliceToolButton}
      {pencilToolButton}
      {eraserToolButton}
      {areaEraserToolButton}
      {panToolButton}
      {labelViewerToolButton}
      {showUnlabeledAreasButton}
      {loadImageButton}
      {saveButton}
      {loadLabelsButton}
      {zoomInButton}
      {zoomOutButton}
      {undoButton}
      {redoButton}
    </div>
  )
};

export default ToolPicker;
