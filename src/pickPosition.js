var picking = false;
var labelEntity;
var leftMenu = document.getElementById("modelInfo");
function pick() {
    
    if(leftMenu.style.display="block"){
        leftMenu.style.display="none";
    }
    // var scene = viewer.scene;
    // var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);  
    // handler.setInputAction(function (movement) {  
    //     var pick = viewer.scene.pick(movement.endPosition);  
    //     if(!temp && Cesium.defined(pick)){  
    //         if(pick.mesh){  
    //             document.getElementById("modelName").textContent=pick.mesh._name;  
    //         }else{  
    //             document.getElementById("modelName").textContent="Name";  
    //         }  
    //         var pos = getPos(event);  
    //         document.getElementById("modelInfo").style.left = pos.x +"px";  
    //         document.getElementById("modelInfo").style.top = pos.y +"px";  
    //         document.getElementById("modelInfo").style.display = "block";  
    //     }else{  
    //         document.getElementById("modelInfo").style.display = "none";  
    //     }  
    // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    var scene = viewer.scene;
    var scene = viewer.scene;
    if (viewer.entities.getById("labelEntity") == undefined) {
        labelEntity = viewer.entities.add({
            id: "labelEntity",
            label: {
                show: false,
                showBackground: true,
                font: '14px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                //pixelOffset: new Cesium.Cartesian2(15, -10)
            }
        });
    } else {
        labelEntity.show = true;
    }

    if (picking == true) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        labelEntity.label.show = false;
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
                      leftMenu.style.left=movement.endPosition.x+"px";
                      leftMenu.style.top=(movement.endPosition.y-80)+"px"
                  var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                  var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
                  var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
                  var heightString = cartographic.height.toFixed(5) + 20;
 
                  labelEntity.position = cartesian;
                  labelEntity.label.show = true;
                  leftMenu.innerHTML = `<p>Lon: ${longitudeString}</p><p>Lat: ${latitudeString}</p><p>Alt:${heightString}</p>`
                  labelEntity.label.text =
                    'Lon: ' + ('   ' + longitudeString).slice(-10) + '\u00B0' +
                    '\nLat: ' + ('   ' + latitudeString).slice(-10) + '\u00B0' +
                    '\nAlt: ' + ('   ' + heightString).slice(-10) + 'm';
 
                    
 
                  // labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -cartographic.height * (scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0));
 
                  foundPosition = true;
                }else{
                      leftMenu.style.display = "none";
                }
              } else {
                var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
                var heightString = cartographic.height.toFixed(5);
 
                labelEntity.position = cartesian;
                labelEntity.label.show = true;
                labelEntity.label.text =
                  'Lon: ' + ('   ' + longitudeString).slice(-10) + '\u00B0' +
                  '\nLat: ' + ('   ' + latitudeString).slice(-10) + '\u00B0' +
                  '\nAlt: ' + ('   ' + heightString).slice(-10) + 'm';
 
 
                labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -cartographic.height * (scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0));
 
                foundPosition = true;
              }
            }
 
            if (!foundPosition) {
              labelEntity.label.show = false;
            }
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

}