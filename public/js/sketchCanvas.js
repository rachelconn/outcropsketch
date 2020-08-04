let canvasWidth = 0;
let canvasHeight = 0;

let path;
let overlay;
let sketch = [];

let classColor = "#a51c1c";
let areaColor = "#a51c1c50";

let pointData = [];
let strokeData = [];

let aColor = "#a51c1c";
let bColor = "#c27c21";
let cColor = "#c0bd27";
let dColor = "#26c221";
let eColor = "#21c2ad";
let fColor = "#2421c2";
let gColor = "#9c21c2";

function changeTool(tool) {
    document.getElementById('lineSketch').className = '';
    document.getElementById('dottedSketch').className = '';
    document.getElementById('areaSketch').className = '';
    document.getElementById('erase').className = '';
    document.getElementById(tool).className = 'active';

    if (tool === 'lineSketch') {
        lineSketch.activate();
    }
    else if (tool === 'dottedSketch') {
        dottedSketch.activate();
    }
    else if (tool === 'areaSketch') {
        areaSketch.activate();
    }
    else {
        eraser.activate();
    }
}

function changeClass(name) {
    document.getElementById('A').className = '';
    document.getElementById('B').className = '';
    document.getElementById('C').className = '';
    document.getElementById('D').className = '';
    document.getElementById('E').className = '';
    document.getElementById('F').className = '';
    document.getElementById('G').className = '';
    document.getElementById(name).className = 'active';

    if (name === 'A') {
        classColor = "#a51c1c";
        areaColor = "#a51c1c50";
    }
    else if (name === 'B') {
        classColor = "#c27c21";
        areaColor = "#c27c2150";
    }
    else if (name === 'C') {
        classColor = "#c0bd27";
        areaColor = "#c0bd2750";
    }
    else if (name === 'D') {
        classColor = "#26c221";
        areaColor = "#26c22150";
    }
    else if (name === 'E') {
        classColor = "#21c2ad";
        areaColor = "#21c2ad50";
    }
    else if (name === 'F') {
        classColor = "#2421c2";
        areaColor = "#2421c250";
    }
    else if (name === 'G') {
        classColor = "#9c21c2";
        areaColor = "#9c21c250";
    }
}

//Initialize Paper Canvas On Load
window.onload = function() {
    
    //Collect pressure and tilt data during sketching events
    // document.getElementById('sketchCanvas').addEventListener('pointerdown', function(event) {
    //     pressure = event.pressure;
    //     tiltx = event.tiltx;
    //     tilty = event.tilty;
        
    //     //Compute actual tilt
    //     var radianTiltx = tiltx * (Math.PI / 180);
    //     var radianTilty = tilty * (Math.PI / 180);
    //     var tanTiltx = Math.tan(radianTiltx);
    //     var tanTilty = Math.tan(radianTilty);
    //     var azix = Math.atan(tanTilty / tanTiltx);
    //     if (azix != 0) {
    //          tilt = Math.abs(Math.atan(Math.sin(azix) / tanTilty)) * (180 / Math.PI);
    //     }
    //     else {
    //         tilt = 90;
    //     }
    // })

    //Associate Paper JS with Canvas
    var canvas = document.getElementById('sketchCanvas');
    paper.setup(canvas);
    canvasWidth = paper.view.size.width;
    canvasHeight = paper.view.size.height;

    //Set up ruler
    // let ruler = new PlainDraggable(document.getElementById('ruler'));
    // scaleRuler(speciesData.mmScale);

    //Activate sketch tool
    lineSketch.activate();
    //generateOverlay();
    
    //Rescale function
    // paper.Raster.prototype.rescale = function(width, height) {
    //     this.scale(width / this.width, height / this.height);
    // };
}    

//Brush tools
let lineSketch = new paper.Tool();
let areaSketch = new paper.Tool();
let dottedSketch = new paper.Tool();
let eraser = new paper.Tool();
let pointID = 0;

//Annotation brush
lineSketch.onMouseDown = function(event) {
    path = new paper.Path();
    path.strokeColor = classColor;
    path.strokeWidth = 3;
    path.strokeCap = "round";

    //Save data
    let point = {x: event.point.x, y: event.point.y, id: pointID };
    pointData.push(point);
    pointID++;
}

lineSketch.onMouseDrag = function(event) {
    path.add(event.point);

    //Save data
    let point = { x: event.point.x, y: event.point.y, id: pointID };
    pointData.push(point);
    pointID++;
}

lineSketch.onMouseUp = function(event) { 
    path.smooth();
    sketch.push(path);
    
    //Save data
    strokeData.push(pointData);
    pointID = 0;

    
    //evaluateOutline(pointData, speciesData.outline);
}

dottedSketch.onMouseDown = function(event) {
    path = new paper.Path();
    path.strokeColor = classColor;
    path.strokeWidth = 3;
    path.strokeCap = "round";
    path.dashArray = [10, 10];

    //Save data
    let point = {x: event.point.x, y: event.point.y, id: pointID };
    pointData.push(point);
    pointID++;
}

dottedSketch.onMouseDrag = function(event) {
    path.add(event.point);

    //Save data
    let point = { x: event.point.x, y: event.point.y, id: pointID };
    pointData.push(point);
    pointID++;
}

dottedSketch.onMouseUp = function(event) { 
    path.smooth();
    sketch.push(path);
    
    //Save data
    strokeData.push(pointData);
    pointID = 0;

    
    //evaluateOutline(pointData, speciesData.outline);
}

//Axis brush
areaSketch.onMouseDown = function(event) {
    path = new paper.Path();
    path.strokeColor = classColor;
    path.fillColor = areaColor;
    path.strokeWidth = 3;
    path.strokeCap = "round";

    //Save data
    let point = {x: event.point.x, y: event.point.y, id: pointID };
    pointData.push(point);
    pointID++;
}

areaSketch.onMouseDrag = function(event) {
    path.add(event.point);

    //Save data
    let point = { x: event.point.x, y: event.point.y, id: pointID };
    pointData.push(point);
    pointID++;
}

areaSketch.onMouseUp = function(event) { 
    path.smooth();
    sketch.push(path);
    
    //Save data
    strokeData.push(pointData);
    pointID = 0;
}

//Eraser tool
eraser.onMouseDown = erase;
eraser.onMouseDrag = erase;

function erase(event) {

    //dataChanged = true;
    let hits = paper.project.hitTestAll(event.point, {
        segments: true,
        fill: true,
        class: paper.Path,
        tolerance: 5,
        stroke: true
    });

    if (hits.length) {
        for (var i = 0; i < hits.length; i++) {
            let hit = hits[i];
            
            hit.item.remove();
        }
    }
}