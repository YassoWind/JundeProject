function fly() {

    var options = {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas
    };
    viewer.dataSources.add(Cesium.KmlDataSource.load('../Data/KML/bikeRide.kml', options)).then(function(dataSource) {
        viewer.clock.shouldAnimate = false;
        var rider = dataSource.entities.getById('tour');
        viewer.flyTo(rider).then(function() {
            viewer.trackedEntity = rider;
            viewer.selectedEntity = viewer.trackedEntity;
            viewer.clock.multiplier = 30;
            viewer.clock.shouldAnimate = true;
        });
    });

}

function home() {

    if (tileset != undefined)
        viewer.camera.flyToBoundingSphere(tileset.boundingSphere);
    else
        viewer.camera.flyHome();
}