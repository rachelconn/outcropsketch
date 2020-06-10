let menuOpen = 0;
let registerActive = 0;

function toggleMenu() {
    if (menuOpen === 0) {
        menuOpen = 1;
        document.getElementById('toggleButton').className = "active";

    }
    else {
        menuOpen = 0;
        document.getElementById('toggleButton').className = "";
    }
}

function changeTool(tool) {
    document.getElementById('sketch').className = "";
    document.getElementById('erase').className = "";
    if (tool === "sketch") {
        if (step === 2 || step === 3) {
            axis.activate();
        }
        else {
            outline.activate();
        }
        
        document.getElementById('sketch').className = "active";
    }
    else {
        eraser.activate();
        document.getElementById('erase').className = "active";
    }
}


function toggleRegister() {
    if (registerActive) {
        registerActive = 0;
        document.getElementById('registerOverlay').className = '';
    }
    else {
        registerActive = 1;
        document.getElementById('registerOverlay').className = 'active';
    }
}

function chooseShape(shape) {
    document.getElementById('choicePanel_bean').className = 'choiceOption';
    document.getElementById('choicePanel_oval').className = 'choiceOption';
    document.getElementById('choicePanel_subTriangular').className = 'choiceOption';
    document.getElementById('choicePanel_subRectangular').className = 'choiceOption';

    document.getElementById(shape).className = 'choiceOption active';

    setTimeout(function() { nextStep()}, 1000);
    
}

function chooseSize(size) {
    document.getElementById('small').className = 'choiceOption';
    document.getElementById('medium').className = 'choiceOption';
    document.getElementById('large').className = 'choiceOption';

    document.getElementById(size).className = 'choiceOption active';

    setTimeout(function() { nextStep()}, 1000);
}

function chooseOrnamentation(ornamentation) {
    if (document.getElementById(ornamentation).className === 'choiceOption') {
        document.getElementById(ornamentation).className = 'choiceOption active';
    }
    else {
        document.getElementById(ornamentation).className = 'choiceOption';
    }
}

function changeFilter(type) {
    document.getElementById('default').className = '';
    document.getElementById('edges').className = '';
    document.getElementById('posterized').className = '';

    document.getElementById(type).className = 'active';
    document.getElementById('sketchCanvas').style.background = "#000000 url('images/geo-"+type+".jpg') no-repeat";
    document.getElementById('sketchCanvas').style.backgroundSize = "100vw";
}