function calculateArea(lla) {

    var area = 0;
    for (var i = 0; i < lla.length / 2 - 1; i++) {
        var lng1 = lla[2 * i];
        var lat1 = lla[2 * i + 1];

        var lng2 = lla[2 * i + 2];
        var lat2 = lla[2 * i + 3];



        var result1, result2;
        var GP = new Cesium.GeographicProjection();
        result1 = GP.project(new Cesium.Cartographic(Cesium.Math.toRadians(lng1), Cesium.Math.toRadians(lat1), 0))
        result2 = GP.project(new Cesium.Cartographic(Cesium.Math.toRadians(lng2), Cesium.Math.toRadians(lat2), 0))



        area += result1.x * result2.y - result1.y * result2.x;
        console.log(result2);
    }
    var i = lla.length / 2 - 1;
    var lng1 = lla[2 * i];
    var lat1 = lla[2 * i + 1];

    var lng2 = lla[0];
    var lat2 = lla[1];

    var result1, result2;
    var GP = new Cesium.GeographicProjection();
    result1 = GP.project(new Cesium.Cartographic(Cesium.Math.toRadians(lng1), Cesium.Math.toRadians(lat1), 0))
    result2 = GP.project(new Cesium.Cartographic(Cesium.Math.toRadians(lng2), Cesium.Math.toRadians(lat2), 0))
    area += result1.x * result2.y - result1.y * result2.x;
    area *= 0.5;
    if (area < 0)
        area *= -1;
    $.Pop(`面积：${area} 平方米`,'alert');
    // alert("面积：" + area + " 平方米");
    console.log(area);
}

function calculateCoutour(lla) {

    var startX = lla[0];
    var startY = lla[1];
    var endX = lla[lla.length - 2];
    var endY = lla[lla.length - 1];

    var tempW = (startX > endX ? endX : startX) - 0.0005;
    var tempE = (startX < endX ? endX : startX) + 0.0005;
    var tempN = (startY < endY ? endY : startY) + 0.0005;
    var tempS = (startY > endY ? endY : startY) - 0.0005;

    var data = [];

    var rectangle = Cesium.Rectangle.fromDegrees(tempW, tempS, tempE, tempN);
    viewer.camera.flyTo({ //flyTo
        destination: rectangle,
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
        },
        complete: () => {
            for (var i = 0; i < 100; i++) {
                var tempLNG = Cesium.Math.lerp(startX, endX, i * 0.01);
                var tempLAT = Cesium.Math.lerp(startY, endY, i * 0.01);

                var position = Cesium.Cartesian3.fromDegrees(tempLNG, tempLAT);
                var clickPt = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);
                var cartesian = viewer.scene.pickPosition(clickPt);
                var height = Cesium.Cartographic.fromCartesian(cartesian).height;
                //  console.log(tempLNG + " " + tempLAT + " " + height);
                data.push(height);
            }
            showChart(data);
        }
    });




}

function calculateLength(lla) {

    var length = 0;
    var length3d = 0;
    for (var i = 0; i < lla.length / 2 - 1; i++) {
        var lng1 = lla[2 * i];
        var lat1 = lla[2 * i + 1];

        var lng2 = lla[2 * i + 2];
        var lat2 = lla[2 * i + 3];



        var result1, result2;
        var GP = new Cesium.GeographicProjection();
        result1 = GP.project(new Cesium.Cartographic(Cesium.Math.toRadians(lng1), Cesium.Math.toRadians(lat1), 0))
        result2 = GP.project(new Cesium.Cartographic(Cesium.Math.toRadians(lng2), Cesium.Math.toRadians(lat2), 0))




        length3d += Math.sqrt(
            (result1.x - result2.x) * (result1.x - result2.x) +
            (result1.y - result2.y) * (result1.y - result2.y) +
            (hhh[i] - hhh[i + 1]) * (hhh[i] - hhh[i + 1])
        );

        length += Math.sqrt((result1.x - result2.x) * (result1.x - result2.x) +
            (result1.y - result2.y) * (result1.y - result2.y)

        );

    }

    $.Pop(`平面长度：${length} 米<br/>三维长度：${length3d}`,'alert')
    // alert("平面长度：" + length + " 米\n三维长度：" + length3d);

}

var baseHeight;
var landCell;
var west;
var south;
var east;
var north;
var projectedPointList;

function loadLandCell() {

    baseHeight = 0;
    landCell = null;
    west = 0;
    south = 0;
    east = 0;
    north = 0;
    projectedPointList = [];

    landCell = Cesium.GeoJsonDataSource.load('./Data/JSON/Cell.json');
    landCell.then(function(dataSource) {
        viewer.dataSources.add(dataSource);
        var entities = dataSource.entities.values;
        entity = entities[0];
        baseHeight = entity.properties.baseHeight;
        entity.polygon.material = Cesium.Color.YELLOW.withAlpha(0.5);
        entity.polygon.extrudedHeight = baseHeight;

        var pointCollectionList = new Array();
        var pointCollection = entity.polygon.hierarchy._value.positions;

        projectedPointList = new Array();

        var longitudeMax = 0,
            longitudeMin = 0,
            latitudeMax = 0,
            latitudeMin = 0;

        //遍历计算外包矩形
        for (var i = 0; i < pointCollection.length; i++) {

            var point = pointCollection[i]; //笛卡尔坐标

            var cartographic = ellipsoid.cartesianToCartographic(point);

            var GP = new Cesium.GeographicProjection();
            var projected = GP.project(new Cesium.Cartographic(cartographic.longitude, cartographic.latitude, 0));

            projectedPointList.push(projected);

            if (i == 0) {
                longitudeMax = cartographic.longitude;
                longitudeMin = cartographic.longitude;
                latitudeMax = cartographic.latitude;
                latitudeMin = cartographic.latitude;
                continue;
            }
            if (cartographic.longitude > longitudeMax)
                longitudeMax = cartographic.longitude;
            if (cartographic.latitude > latitudeMax)
                latitudeMax = cartographic.latitude;

            if (cartographic.longitude < longitudeMin)
                longitudeMin = cartographic.longitude;
            if (cartographic.latitude < latitudeMin)
                latitudeMin = cartographic.latitude;
        }

        //console.log(projectedPointList);

        //缩放到外包矩形
        west = Cesium.Math.toDegrees(longitudeMin);
        south = Cesium.Math.toDegrees(latitudeMin);
        east = Cesium.Math.toDegrees(longitudeMax);
        north = Cesium.Math.toDegrees(latitudeMax);

        var rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
        viewer.camera.flyTo({ //flyTo
            destination: rectangle,
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90),
                roll: 0.0
            },
            complete: calTianWaVolume
        });

    }).otherwise(function(error) {

        console.log(error);
    });
}
var colData, rowData;
var tianVolume = 0,
    waVolume = 0;
var totalArea = 0;

function setLandArea(landPolygon, baseHeight) {


    console.log(landPolygon);
    west = 0;
    south = 0;
    east = 0;
    north = 0;

    this.baseHeight = baseHeight;
    var pointCollection = landPolygon;

    projectedPointList = new Array();

    var longitudeMax = 0,
        longitudeMin = 0,
        latitudeMax = 0,
        latitudeMin = 0;

    //遍历计算外包矩形
    for (var i = 0; i < pointCollection.length; i++) {

        var point = pointCollection[i]; //笛卡尔坐标
        console.log(point);
        var cartographic = point; // ellipsoid.cartesianToCartographic(point);
        //console.log(cartographic);
        var GP = new Cesium.GeographicProjection();
        var projected = GP.project(new Cesium.Cartographic(cartographic.longitude, cartographic.latitude, 0));
        //console.log(projected);
        projectedPointList.push(projected);

        if (i == 0) {
            longitudeMax = cartographic.longitude;
            longitudeMin = cartographic.longitude;
            latitudeMax = cartographic.latitude;
            latitudeMin = cartographic.latitude;
            continue;
        }
        if (cartographic.longitude > longitudeMax)
            longitudeMax = cartographic.longitude;
        if (cartographic.latitude > latitudeMax)
            latitudeMax = cartographic.latitude;

        if (cartographic.longitude < longitudeMin)
            longitudeMin = cartographic.longitude;
        if (cartographic.latitude < latitudeMin)
            latitudeMin = cartographic.latitude;
    }

    console.log(longitudeMax);
    console.log(longitudeMin);
    console.log(latitudeMax);
    console.log(latitudeMin);
    //console.log(projectedPointList);

    //缩放到外包矩形
    west = Cesium.Math.toDegrees(longitudeMin) - 0.0005;
    south = Cesium.Math.toDegrees(latitudeMin) - 0.0005;
    east = Cesium.Math.toDegrees(longitudeMax) + 0.0005;
    north = Cesium.Math.toDegrees(latitudeMax) + 0.0005;
    console.log(west);
    console.log(south);
    console.log(east);
    console.log(north);
    var rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);

    //  var rectangle = Cesium.Rectangle.fromCartographicArray(landPolygon);
    viewer.camera.flyTo({ //flyTo
        destination: rectangle,
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
        },
        complete: calTianWaVolume
    });


}

function calTianWaVolume() {
    tianVolume = 0;
    waVolume = 0;
    totalArea = 0;
    var col = 20,
        row = 20;
    colData = (east - west) / col;
    rowData = (north - south) / row;
    for (var i = 0; i < col; i++) {

        for (var j = 0; j < row; j++) {



            var singleCell = {
                p00: calPNP(i, j),
                p01: calPNP(i, j + 1),
                p10: calPNP(i + 1, j),
                p11: calPNP(i + 1, j + 1)
            };
            if (IsCellWithIn(singleCell)) {

                CalVolume(singleCell);


            } else
                continue;
        }
    }

    $.Pop(`填方体积：${Math.abs(tianVolume)} 立方米<br/>挖方体积：${Math.abs(waVolume)} 立方米<br/>总面积 ${totalArea} 平方米`,'alert')
    // alert("填方体积：" + Math.abs(tianVolume) + "立方米\n挖方体积：" + Math.abs(waVolume) + "立方米\n总面积：" + totalArea + "平方米");

}
var count = 0;
var lastHeight = 0;
//根据格网坐标获得格网点的笛卡尔坐标、投影坐标及高程
function calPNP(i, j) {
    var lng = west + i * colData;
    var lat = south + j * rowData;
    var position = Cesium.Cartesian3.fromDegrees(lng, lat);
    var cartographic = Cesium.Cartographic.fromDegrees(lng, lat);
    var GP = new Cesium.GeographicProjection();
    var projected = GP.project(cartographic);

    return {
        "position": position,
        "projected": projected,
        "height": 0,
        "h": 0,
        "num": i * 2 + j,
        "tianh": [],
        "wah": []
    };


}

function CalVolume(cell) {
    var height;
    try {
        var clickPt = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cell.p00.position);
        var cartesian = viewer.scene.pickPosition(clickPt);
        height = Cesium.Cartographic.fromCartesian(cartesian).height.toFixed(5);
        lastHeight = height;
    } catch (e) {
        height = lastHeight;
    }

    cell.p00.height = height;
    cell.p00.h = baseHeight - cell.p00.height;

    try {
        var clickPt = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cell.p11.position);
        var cartesian = viewer.scene.pickPosition(clickPt);
        height = Cesium.Cartographic.fromCartesian(cartesian).height.toFixed(5);
        lastHeight = height;
    } catch (e) {
        height = lastHeight;
    }

    cell.p11.height = height;
    cell.p11.h = baseHeight - cell.p11.height;

    try {
        var clickPt = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cell.p01.position);
        var cartesian = viewer.scene.pickPosition(clickPt);
        height = Cesium.Cartographic.fromCartesian(cartesian).height.toFixed(5);
        lastHeight = height;
    } catch (e) {
        height = lastHeight;
    }

    cell.p01.height = height;
    cell.p01.h = baseHeight - cell.p01.height;

    try {
        var clickPt = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cell.p10.position);
        var cartesian = viewer.scene.pickPosition(clickPt);
        height = Cesium.Cartographic.fromCartesian(cartesian).height.toFixed(5);
        lastHeight = height;
    } catch (e) {
        height = lastHeight;
    }

    cell.p10.height = height;
    cell.p10.h = baseHeight - cell.p10.height;
    var CalMode = chooseMode(cell);
    var d2 = (cell.p11.projected.x - cell.p00.projected.x) * (cell.p11.projected.y - cell.p00.projected.y);
    totalArea += d2;
    switch (CalMode) {

        case 1:
            {
                if (cell.tianh.length != 0) {

                    tianVolume += (cell.tianh[0] + cell.tianh[1] + cell.tianh[2] + cell.tianh[3]) *
                        d2 / 4;
                } else {
                    waVolume -= (cell.wah[0] + cell.wah[1] + cell.wah[2] + cell.wah[3]) *
                        d2 / 4;
                }
                break;
            }
        case 2:
            {
                var deltaTian = (cell.tianh[0] + cell.tianh[1]) * (cell.tianh[0] + cell.tianh[1]) *
                    d2 / (4.0 * (cell.tianh[0] + cell.tianh[1] + cell.wah[0] + cell.wah[1]));



                tianVolume += deltaTian;

                var deltaWa = (cell.wah[0] + cell.wah[1]) * (cell.wah[0] + cell.wah[1]) *
                    d2 / 4.0 / (cell.tianh[0] + cell.tianh[1] + cell.wah[0] + cell.wah[1]);
                waVolume += deltaWa;
                // console.log(deltaTian + " " + deltaWa);
                break;
            }
        case 3:
            {
                if (cell.tianh.length == 1) {

                    var deltaTian = cell.tianh[0] * cell.tianh[0] * cell.tianh[0] *
                        d2 / 6 / (cell.tianh[0] + cell.wah[0]) / (cell.tianh[0] + cell.wah[2]);
                    tianVolume += deltaTian;

                    var deltaWa = Math.abs((2 * cell.wah[0] + 2 * cell.wah[2] + cell.wah[1] - cell.tianh[0]) * d2 / 6);
                    waVolume += deltaWa;

                } else {
                    var deltaWa = cell.wah[0] * cell.wah[0] * cell.wah[0] *
                        d2 / 6 / (cell.wah[0] + cell.tianh[0]) / (cell.wah[0] + cell.tianh[2]);


                    var deltaTian = Math.abs((2 * cell.tianh[0] + 2 * cell.tianh[2] + cell.tianh[1] - cell.wah[0]) * d2 / 6);
                    tianVolume += deltaTian;
                    waVolume += deltaWa;

                }
                break;

            }
        case 4:
            {
                var deltaTian = (2 * cell.tianh[0] + 2 * cell.tianh[1] - cell.wah[0] - cell.wah[1]) * d2 / 6
                tianVolume += deltaTian;

                var deltaWa = Math.abs(d2 / 6 *
                    (Math.pow(cell.wah[0], 3) / (cell.wah[0] + cell.tianh[0]) / (cell.wah[0] + cell.tianh[1]) +
                        Math.pow(cell.wah[1], 3) / (cell.wah[1] + cell.tianh[0]) / (cell.wah[1] + cell.tianh[1])));
                waVolume += deltaWa;
                //console.log(deltaTian + " " + deltaWa);
                // console.log(cell.tianh);
                break;
            }
    }




}

function chooseMode(cell) {
    var waNum = 0,
        tianNum = 0;
    var hArray = [cell.p00.h, cell.p01.h, cell.p10.h, cell.p11.h];

    var tianh = new Array();
    var wah = new Array();
    var tianIndex = new Array();
    var waIndex = new Array();

    for (var h in hArray) {
        if (hArray[h] <= 0) {
            waNum++;
            wah.push(hArray[h]);
            waIndex.push(h);

        } else {
            tianNum++;
            tianh.push(hArray[h]);
            tianIndex.push(h);
        }


    }

    cell.tianh = tianh;
    cell.wah = wah;
    if (tianNum == 4 || waNum == 4)
        return 1;
    if (tianNum == 3 || waNum == 3)
        return 3;
    if (tianNum == 2) {
        var indexDelta = tianIndex[1] - tianIndex[0];
        // console.log(cell.tianh);
        if (indexDelta == 1) {
            return 2;
        }
        if (indexDelta == 2)
            return 4;
    }
}


//判断格网中的栅格在多边形中
function IsCellWithIn(cell) {
    if (IsPointWithIn(cell.p00.projected, projectedPointList)) {
        if (IsPointWithIn(cell.p01.projected, projectedPointList)) {
            if (IsPointWithIn(cell.p10.projected, projectedPointList)) {
                if (IsPointWithIn(cell.p11.projected, projectedPointList)) {
                    return true;
                }
            }
        }
    }

    return false;
}


//判断点在多边形内（多边形起点终点相同）
function IsPointWithIn(point, list) {
    var x = point.x;
    var y = point.y;

    var isum, icount, index;
    var dLon1 = 0,
        dLon2 = 0,
        dLat1 = 0,
        dLat2 = 0,
        dLon;

    if (list.length < 3) {
        return false;
    }

    isum = 0;
    icount = list.length;


    for (index = 0; index < icount - 1; index++) {
        if (index == icount - 1) {
            dLon1 = list[index].x;
            dLat1 = list[index].y;
            dLon2 = list[0].x;
            dLat2 = list[0].y;
        } else {
            dLon1 = list[index].x;
            dLat1 = list[index].y;
            dLon2 = list[index + 1].x;
            dLat2 = list[index + 1].y;
        }

        if (((y >= dLat1) && (y < dLat2)) || ((y >= dLat2) && (y < dLat1))) {
            if (Math.abs(dLat1 - dLat2) > 0) {
                dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - y)) / (dLat1 - dLat2);
                if (dLon < x)
                    isum++;
            }
        }
    }

    if ((isum % 2) != 0) {
        return true;
    } else {
        return false;
    }
}