var points = new Array();
ipc.on('selected-route-file', function(event, filePath) {



    var dirName = path.dirname(filePath[0]);
    var fileName = path.basename(filePath[0]);
    track(dirName + "/" + fileName);

})


function selectRoute() {

    ipc.send('open-route-file-dialog');

    return;

}

function track(url) {
    viewer.dataSources.add(Cesium.CzmlDataSource.load(url)).then(function(ds) {
        viewer.trackedEntity = ds.entities.getById('Vehicle');

    });

}
var index = 0;