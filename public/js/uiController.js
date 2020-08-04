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