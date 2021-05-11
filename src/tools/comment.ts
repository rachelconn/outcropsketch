import paper from 'paper';
import Layer from '../classes/layers/layers';

export interface commentProps {
    layer: Layer,
    // point?: paper.Point;
    content?: string;
    fillColor?: paper.Color;
    fontSize?: number;
}

export default function createCommentTool(props: commentProps): paper.Tool {
    const tool = new paper.Tool();
    let text: paper.PointText;
    var context;

    tool.onMouseDown = (event: paper.ToolEvent) => {
        // activate the layer this tool is supposed to use
        paper.project.layers[props.layer].activate();
        
        // set textbox properties
        text = new paper.PointText(event.point);
        text.fillColor = props.fillColor ?? new paper.Color('black');
        text.content = props.content ?? 'new text box';
        text.fontSize = props.fontSize ?? 11;
    };

    tool.onKeyDown = (event: paper.KeyEvent) => {
        context += event.character;
        text.content = props.content ?? context;
    };

    return tool;
};