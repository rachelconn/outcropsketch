let saveOverlay = 0;

let outline = {};
let maxHeight = {};
let maxLength = {};
let details = {};

let outlineTool = new paper.Tool();
let lengthTool = new paper.Tool();
let heightTool = new paper.Tool();
let detailsTool = new paper.Tool();

outlineTool.activate();

let speciesData = { 
    genus: 'Sarsicytheridea',
    variation: 'left',
    image: '',
    width: 0,
    height: 0,

    //Correct choices
    shape: ['oval', 'bean'],
    size: ['medium','large'],
    ornamentation: 'ornamented',
    ornamentationSpecific: ['spinose','ala'], 

    //Sketch Data
    outline: {},
    maxHeight: {},
    maxLength: {},
    details: {}
};


function toggleSaveOverlay() {
    if (saveOverlay === 0) {
        saveOverlay = 1;
        document.getElementById('saveOverlay').className = "active";

    }
    else {
        saveOverlay = 0;
        document.getElementById('saveOverlay').className = "";
    }
}

function switchSketch(option) {
    document.getElementById('sketchOutline').className = '';
    document.getElementById('sketchLength').className = '';
    document.getElementById('sketchHeight').className = '';
    document.getElementById('sketchDetails').className = '';

    document.getElementById(option).className = 'active'; 
    
    if (option === 'sketchOutline') {
        outlineTool.activate();
    }
    else if (option === 'sketchLength') {
        lengthTool.activate();
    }
    else if (option === 'sketchHeight') {
        heightTool.activate();
    }
    else {
        detailsTool.activate();
    }
    
}

function saveSketchData() {
    let sketchData = {
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        sketchData: strokeData
    }

    let jsonData = JSON.stringify(sketchData);
    download(jsonData, 'json.txt', 'text/plain');

    pointData = [];
    strokeData = [];

    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
}