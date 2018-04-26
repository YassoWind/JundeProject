// The Create button was selected
function createLengthClicked() {
    if (labelEntity != undefined)
        labelEntity.label.show = false;
    beginCreate("LENGTH", "SURVEY");
}

function createContourClicked() {
    if (labelEntity != undefined)
        labelEntity.label.show = false;
    beginCreate("CONTOUR", "SURVEY");
}

function createAreaClicked() {
    if (labelEntity != undefined)
        labelEntity.label.show = false;
    beginCreate("AREA", "SURVEY");
}

function createVolumeClicked() {
    if (labelEntity != undefined)
        labelEntity.label.show = false;
    beginCreate("VOLUME", "SURVEY");
}


function collectPolyline() {
    if (labelEntity != undefined)
        labelEntity.label.show = false;
    beginCreate("LENGTH", "MODEL");
}

function collectPolygon() {
    if (labelEntity != undefined)
        labelEntity.label.show = false;
    beginCreate("AREA", "MODEL");
}

function collectVolume() {
    if (labelEntity != undefined)
        labelEntity.label.show = false;
    beginCreate("VOLUME", "MODEL");
}

function collectFlyRoute() {
    if (labelEntity != undefined)
        labelEntity.label.show = false;
    beginCreate("ROUTE", "SURVEY");
}


// The Update button was selected
function updateClicked() {
    showCoordinates(false);
    // enable update
}

function handleDone() {
    console.log('Done!');
}

function showButton(id) {
    var e = document.getElementById(id);
    e.style.display = 'block';
}