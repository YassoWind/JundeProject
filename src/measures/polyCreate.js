var drawLine;

var collection;
var lla = [],
    color,
    stage,
    cartesian,
    cartographic,
    cartographictwo;
color = Cesium.Color.LIME;
var hhh = [];
var createHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
var landPolygon;
var Points = [];
var tianwafangArea;
var mode, missionMode;

const {
    ipcRenderer
} = require('electron');

var messageToWrite;

function beginCreate(createmode, missionMode) {
    viewer.entities.removeById("tianwafang");
    messageToWrite = "";
    this.mode = createmode;
    this.missionMode = missionMode;
    drawGeometryPositions = [];
    if (landPolygon != undefined) {
        viewer.entities.remove(landPolygon);

    }
    landPolygon = viewer.entities.add({
        name: name,
        polygon: {
            show: false,

            material: Cesium.Color.YELLOW.withAlpha(0.5),

        }
    });
    lla = [];
    hhh = [];
    Points = [];
    collection = { latlonalt: [] };
    stage = 0;
    if (missionMode == "SURVEY") {
        if (createmode == "AREA")
            name = "面积量测";
        if (createmode == "LENGTH")
            name = "距离量测";
        if (createmode == "VOLUME")
            name = "体积量测";
        if (createmode == "CONTOUR")
            name = "等高线量测";
        if (createmode == "LENGTH")
            name = "路线绘制";
    } else if (missionMode == "MODEL") {
        if (createmode == "AREA")
            name = "面提取";
        if (createmode == "LENGTH")
            name = "线提取";
        if (createmode == "VOLUME")
            name = "体提取";
    }
    entity = viewer.entities.add({
        name: name,
        label: {
            show: false
        }
    });


    if (this.mode == "AREA" || this.mode == "VOLUME") {
        viewer.entities.removeById("testpolygon");
        viewer.entities.removeById("testpolyline");
        newPolygon = viewer.entities.add({
            name: name,
            id: "testpolygon",
            polygon: {
                show: false,

                material: Cesium.Color.YELLOW.withAlpha(0.3),

            }
        });
        newOutline = viewer.entities.add({
            name: name,
            id: "testpolyline",
            polyline: {
                width: 5,
                show: true,
                material: Cesium.Color.YELLOW.withAlpha(0.5),
            }
        });
    }
    if (this.mode == "LENGTH" || this.mode == "CONTOUR" || this.mode == "ROUTE") {
        viewer.entities.removeById("testpolygon");
        viewer.entities.removeById("testpolyline");
        newOutline = viewer.entities.add({
            name: name,
            id: "testpolyline",
            polyline: {
                width: 5,
                show: true,
                material: Cesium.Color.YELLOW.withAlpha(0.5),
                followSurface: true,
            }
        });
    }
    showCoordinates(true);
    enableClick();
}

function enableClick() {
    createHandler.setInputAction(clickAction, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function disableClick() {
    createHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
}



function enableRightClick() {
    createHandler.setInputAction(rightClickAction, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

function disableRightClick() {
    createHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

function enableDraw() {
    createHandler.setInputAction(draw, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function disableDraw() {
    createHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function clickAction(click) {

    // var cartesian = viewer.scene.pickPosition(click.position);
    // var cartesian2 = viewer.camera.pickEllipsoid(click.position, scene.globe.ellipsoid);
    var cartesian;
    if (viewer.scene.pick(click.position) != undefined)
        cartesian = viewer.scene.pickPosition(click.position);
    else
        cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);



    if (cartesian.x == undefined)
        return;

    if (cartesian) {
        try {
            var setCartographic = ellipsoid.cartesianToCartographic(cartesian);
            drawGeometryPositions.push(setCartographic);
        } catch (e) {

            return;
        }

        collection.latlonalt.push(
            Cesium.Math.toDegrees(setCartographic.latitude).toFixed(15),
            Cesium.Math.toDegrees(setCartographic.longitude).toFixed(15),
            Cesium.Math.toDegrees(setCartographic.height).toFixed(15)
        );
        lla.push(Cesium.Math.toDegrees(setCartographic.longitude), Cesium.Math.toDegrees(setCartographic.latitude));
        hhh.push(setCartographic.height);

        var h = setCartographic.height;
        var ch = ellipsoid.cartographicToCartesian(new Cesium.Cartographic(setCartographic.longitude, setCartographic.latitude, h))
        Points.push(ch);

        if (lla.length >= 4) {
            console.log((lla.length / 2) + ' Points Added');
        }

        enableRightClick();
        enableDraw();

    }

}

var pickedPosition;
var scratchZoomPickRay = new Cesium.Ray();
var scratchPickCartesian = new Cesium.Cartesian3();

var drawGeometryPositions = [];


var lastEntityID = [];
var EntityOptions = [];

function rightClickAction(doubleClick) {


    if (HeightGetMode == false) {
        clickAction(doubleClick);
        finish();
    } else if (HeightGetMode == true)
        finish();
    var len = collection.latlonalt.length;

    if (this.mode == "LENGTH" && this.missionMode == "MODEL") {
        if (len > 6) {
            collection.rad = (len / 3);

            viewer.entities.remove(entity);
            console.log(drawGeometryPositions);

            var positionContent = "";
            for (var index = 0; index < drawGeometryPositions.length; index++)
                positionContent += Cesium.Math.toDegrees(drawGeometryPositions[index].longitude) + "," + Cesium.Math.toDegrees(drawGeometryPositions[index].latitude) + "," + drawGeometryPositions[index].height + "\n";
            var message = 'polyline\n' + 'wgs84\n' + len / 3 + '\n' + positionContent;
            ipcRenderer.send('sendPoints', message);
            finish();

            var labelName = "线标记" + EntityOptions.length;
            var options = {
                name: labelName,
                id: labelName,
                polyline: {
                    width: 5,
                    show: true,
                    material: Cesium.Color.YELLOW.withAlpha(0.5),
                    positions: JSON.parse(JSON.stringify(Points))
                }
            };
            var temp = viewer.entities.add(options);

            addzNodes({
                地图标注: [
                    { name: labelName, option: options, type: "LABEL" },

                ],
            });
            EntityOptions.push(options);

            lastEntityID.push(temp.id);
        }
        return;
    }
    if (this.mode == "AREA" && this.missionMode == "MODEL") {
        if (len > 6) {
            collection.rad = (len / 3);

            viewer.entities.remove(entity);
            console.log(drawGeometryPositions);

            var totalH = 0;
            var positionContent = "";
            for (var index = 0; index < drawGeometryPositions.length; index++)
                totalH += drawGeometryPositions[index].height;
            var meanH = totalH / drawGeometryPositions.length;
            for (var index = 0; index < drawGeometryPositions.length; index++)
                positionContent += Cesium.Math.toDegrees(drawGeometryPositions[index].longitude) + "," + Cesium.Math.toDegrees(drawGeometryPositions[index].latitude) + "," + meanH + "\n";
            var message = 'polygon\n' + 'wgs84\n' + len / 3 + '\n' + positionContent;
            ipcRenderer.send('sendPoints', message);
            finish();


            var tempPoints = JSON.parse(JSON.stringify(Points));
            var labelName = "面标记" + EntityOptions.length;
            var options = {
                name: labelName,
                id: labelName,
                polygon: {
                    show: true,

                    material: Cesium.Color.YELLOW.withAlpha(0.7),
                    hierarchy: tempPoints
                },

            }
            var temp = viewer.entities.add(options);


            addzNodes({
                地图标注: [
                    { name: labelName, option: options, type: "LABEL" },

                ],
            });


            EntityOptions.push(options);

            lastEntityID.push(temp.id);
        }
        return;
    }

}

function deleteLabelByID(id) {

    viewer.entities.removeById(id);

}

function flyToLabelByID(id) {
    var entity = viewer.entities.getById(id);
    console.log(entity);
    viewer.zoomTo(entity);

}

function draw(movement) {

    if (stage === 0) {


        if (scene.mode !== Cesium.SceneMode.MORPHING) {
            var pickedObject = scene.pick(movement.endPosition);
            if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {



                // var cartesian = viewer.scene.pickPosition(movement.endPosition);

                var cartesian;
                if (viewer.scene.pick(movement.endPosition) != undefined)
                    cartesian = viewer.scene.pickPosition(movement.endPosition);
                else
                    cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);




                if (Cesium.defined(cartesian)) {
                    cartographic = ellipsoid.cartesianToCartographic(cartesian);
                    entity.position = new Cesium.CallbackProperty(function() {
                        return Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic);
                    }, false);
                    stage = 1;
                }
            }
        }



    } else if (stage === 1) {

        if (scene.mode !== Cesium.SceneMode.MORPHING) {
            var pickedObject = scene.pick(movement.endPosition);
            if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
                //var cartesian = viewer.scene.pickPosition(movement.endPosition);


                var cartesian;
                if (viewer.scene.pick(movement.endPosition) != undefined)
                    cartesian = viewer.scene.pickPosition(movement.endPosition);
                else
                    cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);



                if (Cesium.defined(cartesian)) {
                    cartographictwo = ellipsoid.cartesianToCartographic(cartesian);


                    entity.position = new Cesium.CallbackProperty(function() {
                        return Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographictwo);
                    }, false);

                    if (this.mode == "AREA" || this.mode == "VOLUME") {

                        if (this.missionMode == "MODEL")
                            newPolygon.polygon.perPositionHeight = true;
                        else
                            newPolygon.polygon.perPositionHeight = false;
                        if (HeightGetMode == false) {

                            var totalHeight = 0;
                            newPolygon.polygon.hierarchy = new Cesium.CallbackProperty(function() {

                                var Cartesian3Array = new Array();


                                for (var i = 0; i < Points.length; i++) {


                                    var tempP = Points[i];
                                    var ccc = ellipsoid.cartesianToCartographic(tempP);
                                    totalHeight += ccc.height;

                                    Cartesian3Array.push(tempP);
                                }
                                Cartesian3Array.push(cartesian);

                                return Cartesian3Array;

                            }, false);

                        }
                        if (HeightGetMode == true) {

                            newPolygon.polygon.extrudedHeight = cartographictwo.height;


                        }
                        newPolygon.polygon.show = true;


                    }
                    if (this.mode == "LENGTH" || this.mode == "CONTOUR" || this.mode == "ROUTE") {

                        newOutline.polyline.positions = new Cesium.CallbackProperty(function() {

                            var Cartesian3Array = new Array();
                            for (var i = 0; i < Points.length; i++) {
                                Cartesian3Array.push(Points[i]);
                            }

                            Cartesian3Array.push(cartesian);
                            return Cartesian3Array;

                        }, false);
                        newOutline.polyline.show = true;
                    }
                }
            }
        }
    }
}


function emptyArray() {
    while (lla.length > 0) {
        lla.pop();
    }
}


var HeightGetMode = false;

function finish() {

    viewer.entities.removeById("testpolygon");
    viewer.entities.removeById("testpolyline");

    if (this.missionMode == "SURVEY") {
        if (this.mode == "AREA") {
            calculateArea(lla);

        }
        if (this.mode == "CONTOUR") {


            newOutline.polyline.show = false;
            calculateCoutour(lla);


        }
        if (this.mode == "ROUTE") {
            console.log("route finish");
            makeRoute(drawGeometryPositions);
            newOutline.polyline.show = false;

        }

        if (this.mode == "LENGTH") {

            calculateLength(lla);

        }

        if (this.mode == "VOLUME") {

            setLandArea(drawGeometryPositions, setBaseHeight);


            landPolygon.polygon.hierarchy = newPolygon.polygon.hierarchy;
            landPolygon.polygon.height = 0;
            landPolygon.polygon.extrudedHeight = setBaseHeight;
            landPolygon.polygon.show = true;

            newPolygon.polygon.show = false;

            //if (viewer.entities.contains(tianwafangArea))

            tianwafangArea = viewer.entities.add({
                name: "填挖方范围",
                id: "tianwafang",
                polygon: {
                    show: true,


                    material: Cesium.Color.RED.withAlpha(0.5),
                    hierarchy: newPolygon.polygon.hierarchy,
                }
            });
        }
    } else if (this.missionMode == "MODEL") {

        var len = collection.latlonalt.length;
        if (this.mode == "LENGTH") {

            if (len > 6) {
                collection.rad = (len / 3);

                viewer.entities.remove(entity);
                console.log(drawGeometryPositions);

                var positionContent = "";
                for (var index = 0; index < drawGeometryPositions.length; index++)
                    positionContent += Cesium.Math.toDegrees(drawGeometryPositions[index].longitude) + "," + Cesium.Math.toDegrees(drawGeometryPositions[index].latitude) + "," + drawGeometryPositions[index].height + "\n";
                var message = 'polyline\n' + 'wgs84\n' + len / 3 + '\n' + positionContent;
                ipcRenderer.send('sendPoints', message);
            }
        }

        if (this.mode == "AREA") {
            if (len > 6) {
                collection.rad = (len / 3);

                viewer.entities.remove(entity);
                console.log(drawGeometryPositions);

                var totalH = 0;
                var positionContent = "";
                for (var index = 0; index < drawGeometryPositions.length; index++)
                    totalH += drawGeometryPositions[index].height;
                var meanH = totalH / drawGeometryPositions.length;
                for (var index = 0; index < drawGeometryPositions.length; index++)
                    positionContent += Cesium.Math.toDegrees(drawGeometryPositions[index].longitude) + "," + Cesium.Math.toDegrees(drawGeometryPositions[index].latitude) + "," + meanH + "\n";
                var message = 'polygon\n' + 'wgs84\n' + len / 3 + '\n' + positionContent;
                ipcRenderer.send('sendPoints', message);
            }
        }

        if (this.mode == "VOLUME" && HeightGetMode == false) {

            HeightGetMode = true;
            return;

        }
        if (this.mode == "VOLUME" && HeightGetMode == true) {

            if (len > 6) {
                collection.rad = (len / 3);

                viewer.entities.remove(entity);
                console.log(drawGeometryPositions);

                var totalH = 0;
                var positionContent = "";
                for (var index = 0; index < drawGeometryPositions.length; index++)
                    totalH += drawGeometryPositions[index].height;
                var meanH = totalH / drawGeometryPositions.length;
                var deltaH = meanH - newPolygon.polygon.extrudedHeight._value;

                console.log(deltaH);
                for (var index = 0; index < drawGeometryPositions.length; index++)
                    positionContent += Cesium.Math.toDegrees(drawGeometryPositions[index].longitude) + "," + Cesium.Math.toDegrees(drawGeometryPositions[index].latitude) + "," + meanH + "\n";
                var message = 'building\n' + 'wgs84\n' + len / 3 + '\n' + positionContent + deltaH;
                ipcRenderer.send('sendPoints', message);
            }

        }
    }



    HeightGetMode = false;

    disableDraw();
    disableClick();
    disableRightClick();
    handleDone();
}

function removeLabel() {
    //    console.log( lastEntityID[lastEntityID.length-1]);
    //    viewer.entities.removeById( lastEntityID[lastEntityID.length-1]);
    viewer.entities.removeById(lastEntityID.pop());
    EntityOptions.pop();
}

function saveEntities() {

    var ssss = JSON.stringify(EntityOptions);
    console.log(ssss);
    ipcRenderer.send('save-labels', ssss);
}



function loadEntities() {

    ipc.send('loading-labels');
}

ipc.on('loaded-labels', function(event, options) {

    console.log(options);
    for (var i = 0; i < options.length; i++) {
        var temp = viewer.entities.add(options[i]);
        if (temp.polygon != undefined) {
            temp.polygon.material = Cesium.Color.YELLOW.withAlpha(0.7);
        }
        if (temp.polyline != undefined) {
            temp.polyline.material = Cesium.Color.YELLOW.withAlpha(0.7);

        }
        EntityOptions.push(options[i]);
    }
});