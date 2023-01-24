import paper from 'paper-jsdom-canvas';
import { Cursor } from '../classes/cursors/cursors';
import Layer from '../classes/layers/layers';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { setCursor, setLayer, setTool } from '../redux/actions/options';
import store from '../redux/store';

export interface ToolProps {
  cursor: Cursor;
  layer?: Layer;
  toolOptions: ToolOption[];
  onMouseMove?: (e: paper.ToolEvent) => any;
  onMouseDown?: (e: paper.ToolEvent) => any;
  onMouseDrag?: (e: paper.ToolEvent) => any;
  onMouseUp?: (e: paper.ToolEvent) => any;
  onDeactivate?: () => any;
};

// Remember last selected tool's deactivation function to allow running it when a new tool is activated
let lastToolDeactivate: () => any;

// Queued mouseDown event to fire after making sure the user intended to use a tool
let queuedHandler: () => any;

// Variables to determine whether tool events should be run - sketch canvas should use these to set the proper
interface ToolHandlerStatus {
  mouseHasMoved: boolean,
  shouldHandleToolEvents: boolean,
}
export const toolHandlerStatus: ToolHandlerStatus = {
  mouseHasMoved: false,
  shouldHandleToolEvents: true,
};

/**
 * Creates a paper tool that hooks activate() to update redux state like the cursor, tool options, and active tool.
 * Use this whenever creating a new tool to avoid having to manually update redux state.
 * @param props Options and callbacks to create a tool with
 * @returns The created tool
 */
export default function createTool(props: ToolProps): paper.Tool {
  const tool = new paper.Tool();

  // Override activate function to set appropriate tool options, cursor, and redux state
  const originalActivate = tool.activate;
  tool.activate = () => {
    // Deactivate old tool (if necessary)
    if (lastToolDeactivate) lastToolDeactivate();

    // Set layer before activation (if necessary)
    if (props.layer) {
      store.dispatch(setLayer(props.layer));
    }

    originalActivate.call(tool);

    store.dispatch(setTool(tool, props.toolOptions));
    store.dispatch(setCursor(props.cursor));
    // Remember new deactivate function
    lastToolDeactivate = props.onDeactivate;
  };

  // Wrap tool callbacks to allow for touch listeners to prevent them from running
  tool.onMouseDown = (e: paper.ToolEvent) => {
    toolHandlerStatus.mouseHasMoved = false;
    toolHandlerStatus.shouldHandleToolEvents = true;
    if (props.onMouseDown) queuedHandler = () => props.onMouseDown(e);
  };

  tool.onMouseMove = (e: paper.ToolEvent) => {
    if (toolHandlerStatus.shouldHandleToolEvents) {
      if (queuedHandler) queuedHandler();
      queuedHandler = undefined;
      if (props.onMouseMove) props.onMouseMove(e);
    }
  };

  tool.onMouseDrag = (e: paper.ToolEvent) => {
    toolHandlerStatus.mouseHasMoved = true;
    if (toolHandlerStatus.shouldHandleToolEvents) {
      if (queuedHandler) queuedHandler();
      queuedHandler = undefined;
      if (props.onMouseDrag) props.onMouseDrag(e);
    }
  };

  tool.onMouseUp = (e: paper.ToolEvent) => {
    if (toolHandlerStatus.shouldHandleToolEvents) {
      if (props.onMouseUp) props.onMouseUp(e);
    }
  };

  return tool;
};
