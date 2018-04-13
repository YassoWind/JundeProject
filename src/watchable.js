// var maxLength;
// var height;
// var perAngle;
// var perLength;
function watchable() {
    createHandler.setInputAction(getWatchPoint, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}

function disableWatchable() {
    createHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}

function getWatchPoint(doubleClick) {

    var cartesian = viewer.scene.pickPosition(doubleClick.position);
    watchPoint = ellipsoid.cartesianToCartographic(cartesian);
    flyToWatchable();
    disableWatchable();
}
var watchPoint;

function flyToWatchable() {

    var cartographic = watchPoint; // Cesium.Cartographic.fromDegrees(114.35572, 30.52795);
    viewer.camera.flyTo({ //flyTo
        destination: Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, watchPoint.height + 200),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
        },
        complete: drawWatchAble
    });

}

function initDraw() {
    viewer.entities.removeAll();
    viewer.render();
}

function drawWatchAble() {
    // initDraw();
    var cartographic = watchPoint; // Cesium.Cartographic.fromDegrees(114.35572, 30.52795);
    var GP = new Cesium.GeographicProjection();
    var projected = GP.project(cartographic);

    var cartographic1 = GP.unproject(projected);

    var maxTan = 0;
    var minTan = -1000;
    // var maxLength = 20;
    var height = watchPoint.height + watchableSettings.height;
    // var perAngle = 3;
    // var perLength = 1;

    viewer.entities.add({ //加点  
        position: Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height),
        point: {
            color: Cesium.Color.BLUE,
            pixelSize: 10
        }
    });
    for (var Angle = 0; Angle < 360; Angle += watchableSettings.perAngle) {
        //console.log(Angle * 100 / 360);
        //document.getElementById("data").innerHTML = Angle * 100 / 360;
        var zheng = false;
        for (var Length = watchableSettings.perLength; Length < watchableSettings.maxLength; Length += watchableSettings.perLength) {
            var x = projected.x + Length * Math.sin(Cesium.Math.toRadians(Angle));
            var y = projected.y + Length * Math.cos(Cesium.Math.toRadians(Angle));
            var point = new Cesium.Cartesian3(x, y, 0);
            var cartographic1 = GP.unproject(point); //弧度的经纬度坐标

            var tempCartesian = Cesium.Cartesian3.fromRadians(cartographic1.longitude, cartographic1.latitude, height);

            var clickPt = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, tempCartesian);

            if (scene.pickPositionSupported) {
                var cartesian = viewer.scene.pickPosition(clickPt);

                if (Cesium.defined(cartesian)) {
                    var currentHeight = Cesium.Cartographic.fromCartesian(cartesian).height.toFixed(10);
                    var tan = (currentHeight - height) / Length;
                    if (tan > 0) {
                        zheng = true;
                        if (tan > maxTan) {
                            viewer.entities.add({ //加点  
                                position: Cesium.Cartesian3.fromRadians(cartographic1.longitude, cartographic1.latitude, currentHeight),
                                point: {
                                    color: Cesium.Color.GREEN,
                                    pixelSize: 3
                                }
                            });
                            maxTan = tan;
                        } else {
                            //console.log("red");
                            viewer.entities.add({ //加点  
                                position: Cesium.Cartesian3.fromRadians(cartographic1.longitude, cartographic1.latitude, currentHeight),
                                point: {
                                    color: Cesium.Color.RED,
                                    pixelSize: 3
                                }
                            });
                        }
                    } else if (tan < 0) {
                        if (zheng == true) {
                            //console.log("red");
                            viewer.entities.add({ //加点  
                                position: Cesium.Cartesian3.fromRadians(cartographic1.longitude, cartographic1.latitude, currentHeight),
                                point: {
                                    color: Cesium.Color.RED,
                                    pixelSize: 3
                                }
                            });

                            continue;
                        }
                        if (tan > minTan) {
                            viewer.entities.add({ //加点  
                                position: Cesium.Cartesian3.fromRadians(cartographic1.longitude, cartographic1.latitude, currentHeight),
                                point: {
                                    color: Cesium.Color.GREEN,
                                    pixelSize: 3
                                }
                            });

                            mintan = tan;
                        } else {
                            //console.log("red");
                            viewer.entities.add({ //加点  
                                position: Cesium.Cartesian3.fromRadians(cartographic1.longitude, cartographic1.latitude, currentHeight),
                                point: {
                                    color: Cesium.Color.RED,
                                    pixelSize: 3
                                }
                            });
                        }
                    }
                }
            }
        }
    }

}