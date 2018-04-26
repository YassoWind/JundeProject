var picking = false;

var leftMenu = document.getElementById("modelInfo");

function pick() {

    if (leftMenu.style.display = "block") {
        leftMenu.style.display = "none";
    }


    var scene = viewer.scene;

    if (picking == true) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        picking = false;
        return;
    }
    if (picking == false) {
        picking = true;
        // Mouse over the globe to see the cartographic position
        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(function(movement) {
            console.log(pick.mesh)
            if (scene.mode !== Cesium.SceneMode.MORPHING) {
                var pickedObject = scene.pick(movement.endPosition);
                if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
                    var cartesian = viewer.scene.pickPosition(movement.endPosition);

                    if (Cesium.defined(cartesian)) {
                        leftMenu.style.display = "block";
                        leftMenu.style.left = movement.endPosition.x + "px";
                        leftMenu.style.top = (movement.endPosition.y - 80) + "px"
                        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
                        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
                        var heightString = cartographic.height.toFixed(5) + 20;


                        leftMenu.innerHTML = `<p>Lon: ${longitudeString}</p><p>Lat: ${latitudeString}</p><p>Alt:${heightString}</p>`

                        foundPosition = true;
                    } else {
                        leftMenu.style.display = "none";
                    }
                } else {
                    var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
                    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
                    var heightString = cartographic.height.toFixed(5);

                    foundPosition = true;
                }
            }


        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

}