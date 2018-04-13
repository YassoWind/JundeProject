var mousePosition = new Cesium.Cartesian3();
var mousePositionProperty = new Cesium.CallbackProperty(
    function(time, result) {
        var position = scene.camera.pickEllipsoid(mousePosition, undefined, result);
        var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
        return Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic);
    },
    false);

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

function showCoordinates(show) {
    if (show) {
        enableListener();
        entity.label.show = true;
    } else {
        disableListener();
        entity.label.show = false;
    }
}
var labelEntity;

function enableListener() {
    handler.setInputAction(action, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    labelEntity = viewer.entities.add({
        label: {
            show: false,
            showBackground: true,
            font: '14px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(30, -20)
        }
    });
}

function disableListener() {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function action(movement) {}