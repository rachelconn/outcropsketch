import paper from 'paper';
import createFillLassoTool from './tools/fillLasso';

window.onload = () => {
  console.log('test');
  // Initialize canvas
  const canvas = document.getElementById('sketchCanvas') as HTMLCanvasElement;
  paper.setup(canvas);

  // Initialize tools
  const fillLasso = createFillLassoTool();
  fillLasso.activate();

  // Hotkey setup
  // registerToolToKey(brushTool, '1');
  // registerToolToKey(eraserTool, '2');
};
