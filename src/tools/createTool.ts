import paper from 'paper-jsdom-canvas';
import store from '..';
import { Cursor } from '../classes/cursors/cursors';
import Layer from '../classes/layers/layers';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { setCursor, setLayer, setTool } from '../redux/actions/options';

export interface ToolProps {
  cursor: Cursor;
  layer?: Layer;
  toolOptions: ToolOption[];
  onMouseMove?: (event: paper.ToolEvent) => any;
  onMouseDown?: (event: paper.ToolEvent) => any;
  onMouseDrag?: (event: paper.ToolEvent) => any;
  onMouseUp?: (event: paper.ToolEvent) => any;
  onDeactivate?: () => any;
};

// Remember last selected tool's deactivation function to allow running it when a new tool is activated
 let lastToolDeactivate: () => any;

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

  // Set appropriate callbacks
  tool.onMouseMove = props.onMouseMove;
  tool.onMouseDown = props.onMouseDown;
  tool.onMouseDrag = props.onMouseDrag;
  tool.onMouseUp = props.onMouseUp;

  return tool;
};
