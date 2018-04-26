function addKML() {

    loadDLX('././taiyuan/右.kml', "道路线_右");
    loadDLX('././taiyuan/左.kml', "道路线_左");
    addzNodes({
        MARK: [{
            name: '道路线_右',
            type: "DLX",
            id: '道路线_右',
            url: '././taiyuan/右.kml'
        }],
    });
    addzNodes({
        MARK: [{
            name: '道路线_左',
            type: "DLX",
            id: '道路线_左',
            url: '././taiyuan/左.kml'
        }],
    });
}

function loadDLX(url, name) {
    var promise = Cesium.KmlDataSource.load(url, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true
    });
    promise.then(function(dataSource) {
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {

            var dlx = viewer.entities.add({
                id: name,
                name: name,
                corridor: entities[i].corridor

            });



        }
    });
}

function addQM() {
    loadQM('././taiyuan/qm.kmz', "桥面1");
    addzNodes({
        MARK: [{
            name: '桥面1',
            type: "QM",
            id: '桥面1',
            url: '././taiyuan/qm.kmz'
        }],
    });
}

function loadQM(url, name) {
    var promise = Cesium.KmlDataSource.load(url, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true
    });
    promise.then(function(dataSource) {
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
            console.log(entities[i]);
            if (entities[i].polygon != undefined) {
                viewer.entities.add({
                    id: name,
                    name: name,
                    polygon: entities[i].polygon
                });
            }
        }
    });
}

function addZCQ() {


    loadZCQ('././taiyuan/zcq.kmz', "征拆迁范围");

}

function loadZCQ(url, name) {
    var promise2 = Cesium.KmlDataSource.load(url, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true
    });
    promise2.then(function(dataSource) {
        var entities = dataSource.entities.values;

        var bluePin;
        var pinBuilder = new Cesium.PinBuilder();

        for (var i = 1; i < entities.length; i++) {

            //viewer.entities.removeById('里程碑 ' + i + "km");
            var entity = entities[i];
            console.log(entity);

            viewer.entities.add({
                id: entity.name,
                name: entity.name,
                polygon: entity.polygon
            });

            var positions = entity.polygon.hierarchy._value.positions;
            var color = entity.polygon.material.color._value;

            addzNodes({
                MARK: [{
                    name: entity.name,

                    type: "ZCQ",
                    positions: positions,
                    color: color
                }],
            });
        }


    }).otherwise(function(error) {
        //Display any errrors encountered while loading.
        // window.alert(error);
        console.log(error);
    });
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

        for (var i = 1; i < entities.length; i++) {

            viewer.entities.removeById('里程碑 ' + i + "km");
            var entity = entities[i];

            //var name = entity._name;
            var positionValue = entity._position._value;

            var position = new Cesium.Cartesian3(positionValue.x, positionValue.y, positionValue.z);
            var tempPosition = Cesium.Cartographic.fromCartesian(position);
            tempPosition.height += 300;

            position = Cesium.Ellipsoid.WGS84.cartographicToCartesian(tempPosition);
            var questionPin = viewer.entities.add({
                id: '里程碑 ' + i + "km",
                name: '里程碑 ' + i + "km",
                position: position,
                billboard: {
                    image: pinBuilder.fromText(entity._name, Cesium.Color.BLACK, 48).toDataURL(),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    // sizeInMeters: true
                }
            });
            addzNodes({
                MARK: [{
                        name: '里程碑 ' + i + "km",
                        position: position,
                        type: "LCB",
                        pin: entity._name
                    },

                ],
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

        console.log(error);
    });
}