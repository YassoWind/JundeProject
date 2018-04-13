function addKML() {
    // viewer.dataSources.add(Cesium.KmlDataSource.load('././taiyuan/ty.kml', {
    //     camera: viewer.scene.camera,
    //     canvas: viewer.scene.canvas,
    //     clampToGround: true
    // }));
    viewer.dataSources.add(Cesium.KmlDataSource.load('././taiyuan/右.kml', {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true
    }));
    viewer.dataSources.add(Cesium.KmlDataSource.load('././taiyuan/左.kml', {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true
    }));

}

function addQM() {
    viewer.dataSources.add(Cesium.KmlDataSource.load('././taiyuan/qm.kmz', {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true
    }));



}

function addZCQ() {
    viewer.dataSources.add(Cesium.KmlDataSource.load('././taiyuan/zcq.kmz', {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true
    }));



}

function addPoint() {
    var promise2 = Cesium.KmlDataSource.load('././taiyuan/里程.kml', {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true
    });
    promise2.then(function(dataSource) {
        var entities = dataSource.entities.values;

        var bluePin;
        var pinBuilder = new Cesium.PinBuilder();

        //console.log(entities.length);
        for (var i = 1; i < entities.length; i++) {

            var entity = entities[i];

            var name = entity._name;
            var positionValue = entity._position._value;

            var position = new Cesium.Cartesian3(positionValue.x, positionValue.y, positionValue.z);
            var tempPosition = Cesium.Cartographic.fromCartesian(position);
            tempPosition.height += 300;

            position = Cesium.Ellipsoid.WGS84.cartographicToCartesian(tempPosition);
            var questionPin = viewer.entities.add({
                name: 'mark',
                position: position,
                billboard: {
                    image: pinBuilder.fromText(name, Cesium.Color.BLACK, 48).toDataURL(),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    // sizeInMeters: true
                }
            });

        }


    }).otherwise(function(error) {
        //Display any errrors encountered while loading.
        // window.alert(error);
        console.log(error);
    });
}

function addWall() {
    var promise2 = Cesium.GeoJsonDataSource.load('./line.json');
    promise2.then(function(dataSource) {

        var entity = dataSource.entities.values[0];

        var heightMax = [];
        var heightMin = [];
        for (var wallIndex = 0; wallIndex < entity.polyline._positions._value.length; wallIndex++) {

            heightMax.push(100);
            heightMin.push(0);
        }

        var blueWall = viewer.entities.add({
            name: 'wall',
            wall: {
                positions: entity.polyline._positions,
                maximumHeights: heightMax,
                minimumHeights: heightMin,
                material: Cesium.Color.BLUE.withAlpha(0.5),
                outline: false,

            }
        });
        viewer.zoomTo(blueWall);

    }).otherwise(function(error) {
        //Display any errrors encountered while loading.
        // window.alert(error);
        console.log(error);
    });
}