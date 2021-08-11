import paper from 'paper';
import store from '..';
import { Cursor } from '../classes/cursors/cursors';
import { ToolOption } from '../classes/toolOptions/toolOptions';
import { setCursor, setTool } from '../redux/actions/options';

export interface ToolProps {
  cursor: Cursor;
  toolOptions: ToolOption[];
  onMouseMove?: (event: paper.ToolEvent) => any;
  onMouseDown?: (event: paper.ToolEvent) => any;
  onMouseDrag?: (event: paper.ToolEvent) => any;
  onMouseUp?: (event: paper.ToolEvent) => any;
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
    originalActivate.call(tool);

    store.dispatch(setTool(tool, props.toolOptions));
    store.dispatch(setCursor(props.cursor));
  };

  // Set appropriate callbacks
  tool.onMouseMove = props.onMouseMove;
  tool.onMouseDown = props.onMouseDown;
  tool.onMouseDrag = props.onMouseDrag;
  tool.onMouseUp = props.onMouseUp;

  return tool;
};
