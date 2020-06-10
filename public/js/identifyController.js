let instructionsDOM = document.getElementById('instructions');
let prevButton = document.getElementById('prevStep');
let nextButton = document.getElementById('nextStep');

let choicePanel = document.getElementById('choicePanel');
let choicePanel_shape = document.getElementById('choicePanel_shape');
let choicePanel_size = document.getElementById('choicePanel_size');
let choicePanel_ornamentation = document.getElementById('choicePanel_ornamentation');

let treeOverlay = document.getElementById('treeOverlay');

let step = 1;
let axisStep = "major";

function initializeStep() {
    if (step === 1) {
        instructionsDOM.innerHTML = "<strong>Step 1</strong> Sketch the outline of the organism";
        outline.activate();

        choicePanel.className = "";

        treeOverlay.className = "";

    }
    else if (step === 2) {
        instructionsDOM.innerHTML = "<strong>Step 2</strong> Sketch the max length of the organism";
        axis.activate();
        axisStep = "major";

        choicePanel.className = "";

        treeOverlay.className = "";

    }
    else if (step === 3) {
        instructionsDOM.innerHTML = "<strong>Step 3</strong> Sketch the max height of the organism";
        axis.activate();
        axisStep = "minor";

        choicePanel.className = "";

        treeOverlay.className = "";

    }
    else if (step === 4) {
        instructionsDOM.innerHTML = "<strong>Step 4</strong> What shape is this organism?";
        outline.activate();

        choicePanel.className = "active";
        choicePanel_shape.className = "active";
        choicePanel_size.className = "";
        choicePanel_ornamentation.className = "";

        treeOverlay.className = "";

    }
    else if (step === 5) {
        instructionsDOM.innerHTML = "<strong>Step 5</strong> What is the approximate size of this organism?";
        outline.activate();

        choicePanel.className = "active";
        choicePanel_shape.className = "";
        choicePanel_size.className = "active";
        choicePanel_ornamentation.className = "";

        treeOverlay.className = "";

    }
    else if (step === 6) {
        instructionsDOM.innerHTML = "<strong>Step 6</strong> What kind of ornamentation does the organism have?";
        outline.activate();

        choicePanel.className = "active";
        choicePanel_shape.className = "";
        choicePanel_size.className = "";
        choicePanel_ornamentation.className = "active";

        treeOverlay.className = "";



    }
    else if (step === 7) {
        instructionsDOM.innerHTML = "<strong>Step 7</strong> Identify the species based on your observations";
        outline.activate();

        choicePanel.className = "";

        treeOverlay.className = "active";
        generateTreeEdges();


    }
}

function prevStep() {
    if (step === 1) {
        //No more going back
        return;
    }
    else {
        step--;
        initializeStep();
    }
}

function nextStep() {
    if (step === 7) {
        //No more going forward
        return;
    }
    else {
        step++;
        initializeStep();
    }
}
