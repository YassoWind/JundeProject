let start;
let stop;

function makeRoute(Points) {
    let RouteData = [];
    let totalLength = 0;

    RouteData.push({
        longitude: Cesium.Math.toDegrees(Points[0].longitude),
        dimension: Cesium.Math.toDegrees(Points[0].latitude),
        height: Points[0].height + 100,
        time: 0,
    })
    for (let i = 1; i < Points.length; i++) {

        var length = Cesium.Cartesian3.distance(Cesium.Ellipsoid.WGS84.cartographicToCartesian(Points[i - 1]), Cesium.Ellipsoid.WGS84.cartographicToCartesian(Points[i]));
        totalLength += length;
        RouteData.push({
            longitude: Cesium.Math.toDegrees(Points[i].longitude),
            dimension: Cesium.Math.toDegrees(Points[i].latitude),
            height: Points[i].height + 500,
            time: totalLength / 50,
        })


    }
    var startPoint = Points[0];
    startPoint.height += 500;
    var OriPoint = Points[1];
    OriPoint.height += 500;
    flyMove(RouteData, totalLength / 50, Cesium.Ellipsoid.WGS84.cartographicToCartesian(startPoint), Cesium.Ellipsoid.WGS84.cartographicToCartesian(OriPoint));
    setTimeout(function() {
        viewer.entities.removeById("planeModel");
        console.log("stop");


    }, totalLength * 1000 / 50);
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

    viewer.trackedEntity = planeModel;

    viewer.camera.direction = startOritation;


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