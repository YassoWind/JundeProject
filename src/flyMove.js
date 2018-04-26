let start;
let stop;

var FlyIndex;
var RoutePoints;
var RoutePointCount;
var routing;
var lastCameraPosition;
var lastNextIndex;

function PauseRoute() {
    routing = false;
}

function ContinueRoute() {
    routing = true;
    var nowRoute = [];
    nowRoute.push(lastCameraPosition);
    for (var index = lastNextIndex; index < RoutePoints.length; index++) {
        nowRoute.push(RoutePoints[index]);
    }
    makeRoute(nowRoute);
}

function makeRoute(PickPoints) {

    console.log(PickPoints);
    RoutePoints = PickPoints;
    routing = true;
    viewer.scene.screenSpaceCameraController.enableZoom = false;
    viewer.scene.screenSpaceCameraController.enableRotate = false;
    //viewer.scene.screenSpaceCameraController.enableTranslate = false;
    viewer.scene.screenSpaceCameraController.enableLook = false;

    // 鼠标中键拖拽
    viewer.scene.screenSpaceCameraController.enableTilt = false;


    FlyIndex = 0;
    var Points = [];
    for (var i = 0; i < PickPoints.length; i++) {
        var temp = PickPoints[i];
        temp.height += 5;
        Points.push(temp);
    }
    var first = Cesium.Ellipsoid.WGS84.cartographicToCartesian(Points[1]);
    var second = Cesium.Ellipsoid.WGS84.cartographicToCartesian(Points[0]);
    var distance = Cesium.Cartesian3.distance(first, second);
    var direction = new Cesium.Cartesian3((first.x - second.x) / distance, (first.y - second.y) / distance, (first.z - second.z) / distance); //Cesium.Cartesian3.subtract(first, second);

    viewer.camera.flyTo({
        destination: Cesium.Ellipsoid.WGS84.cartographicToCartesian(Points[0]),
        orientation: {
            direction: direction,
            up: first
        },
        complete: function() {
            var routeInterval = setInterval(function() {

                if (FlyIndex < Points.length) {
                    var first = Cesium.Ellipsoid.WGS84.cartographicToCartesian(Points[FlyIndex + 1]);
                    var second = Cesium.Ellipsoid.WGS84.cartographicToCartesian(Points[FlyIndex]);

                    var distance = Cesium.Cartesian3.distance(first, second);
                    var direction = new Cesium.Cartesian3((first.x - second.x) / distance, (first.y - second.y) / distance, (first.z - second.z) / distance); //Cesium.Cartesian3.subtract(first, second);
                    if (routing == true)
                        viewer.camera.move(direction, 0.3);
                    else {
                        lastCameraPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(viewer.camera.position);
                        lastNextIndex = FlyIndex + 1;
                        viewer.scene.screenSpaceCameraController.enableZoom = true;
                        viewer.scene.screenSpaceCameraController.enableRotate = true;
                        viewer.scene.screenSpaceCameraController.enableLook = true;
                        viewer.scene.screenSpaceCameraController.enableTilt = true;


                        clearInterval(routeInterval);


                    }
                } else {
                    clearInterval(routeInterval);
                }
                var distance = Cesium.Cartesian3.distance(Cesium.Ellipsoid.WGS84.cartographicToCartesian(Points[FlyIndex + 1]), viewer.camera.position);

                if (distance < 10) {
                    FlyIndex++;
                    console.log(FlyIndex);

                    var first = Cesium.Ellipsoid.WGS84.cartographicToCartesian(Points[FlyIndex + 1]);
                    var second = Cesium.Ellipsoid.WGS84.cartographicToCartesian(Points[FlyIndex]);
                    var distance = Cesium.Cartesian3.distance(first, second);
                    var direction = new Cesium.Cartesian3((first.x - second.x) / distance, (first.y - second.y) / distance, (first.z - second.z) / distance);
                    viewer.camera.direction = direction;
                }

            }, 50);
        }
    });

}

function flyMove(RouteData, timeLength, startPosition, startOritation) {
    // 起始时间
    start = Cesium.JulianDate.fromDate(new Date(2017, 7, 11));
    // 结束时间
    stop = Cesium.JulianDate.addSeconds(start, timeLength, new Cesium.JulianDate());
    let view = viewer;
    // 设置始时钟始时间
    view.clock.startTime = start.clone();
    // 设置时钟当前时间
    view.clock.currentTime = start.clone();
    // 设置始终停止时间
    view.clock.stopTime = stop.clone();
    // 时间速率，数字越大时间过的越快
    view.clock.multiplier = 1;
    // 时间轴
    view.timeline.zoomTo(start, stop);
    // 循环执行
    //  view.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    //view.entities.removeById("planeModel");

    let property = computeFlight(RouteData);
    // 添加模型
    let planeModel = view.entities.add({
        id: "planeModel",
        // 和时间轴关联
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start: start,
            stop: stop
        })]),
        position: property,
        // 根据所提供的速度计算点
        orientation: new Cesium.VelocityOrientationProperty(property),
        // 模型数据
        model: {
            uri: './addData/Cesium_Air.glb',
            minimumPixelSize: 0,
            maximumScale: 0.001,


        }
    });


    // viewer.camera.setView({ //flyTo
    //     destination: startPosition,
    //     orientation: {
    //         heading: Cesium.Math.toRadians(startOritation),
    //         pitch: Cesium.Math.toRadians(0),
    //         roll: 0.0
    //     }
    // });
    //viewer.camera.position = property
    viewer.trackedEntity = planeModel;
    //console.log(pointsRoute[pointsRoute.length - 1]);

    //viewer.camera.move(pointsRoute[pointsRoute.length - 1], 1);
}


/**
 * 计算飞行
 * @param source 数据坐标
 * @returns {SampledPositionProperty|*}
 */
function computeFlight(source) {
    // 取样位置 相当于一个集合
    let property = new Cesium.SampledPositionProperty();
    for (let i = 0; i < source.length; i++) {
        let time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
        let position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height);
        // 添加位置，和时间对应
        property.addSample(time, position);
    }
    return property;
}