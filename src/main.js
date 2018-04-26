// setInterval(function() {
//     viewer.camera.moveForward(200);

// }, 50);
control();

function closeFunction() {
    var ttt = viewer.entities.getById("labelEntity");
    ttt.show = false;
    viewer.trackedEntity = null;
    viewer.selectedEntity = null;
    // if (labelEntity != undefined)
    //     labelEntity.label.show = false;
    var createHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    createHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    createHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    createHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);

}





function testwuhuang() {

    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(114.44291, 30.47113, 0));
    var model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
        url: './addData/wuhuang.gltf', //如果为bgltf则为.bgltf  


        modelMatrix: modelMatrix,
        scale: 1.0
    }));

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-75.62898254394531, 40.02804946899414, 6.0)
    });


}

function addMovieTemp() {
    var pinBuilder = new Cesium.PinBuilder();

    var labelPointInput = new Cesium.Cartographic(Cesium.Math.toRadians(112.90660), Cesium.Math.toRadians(38.03991), 220 + 1);
    console.log(labelPointInput);
    var position = Cesium.Ellipsoid.WGS84.cartographicToCartesian(labelPointInput);


    bluePin = viewer.entities.add({
        name: "监控视频",
        description: '<iframe width="100%" height="300" src="' + 'https://cesiumjs.org/videos/Sandcastle/big-buck-bunny_trailer.webm' + '" frameborder="0" allowfullscreen autoplay="autoplay"></iframe>',
        position: position,
        billboard: {
            image: pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL(),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,

        }
    });
}

function show() {
    viewer.camera.moveUp(1);

}

function drawCanvas(radius) {

    var camera = new Cesium.Camera(scene);
    camera.position = new Cesium.Cartesian3.fromDegrees(112.85806, 37.95488, 500);
    camera.direction = Cesium.Cartesian3.negate(Cesium.Cartesian3.UNIT_Z, new Cesium.Cartesian3());
    camera.up = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_Y);
    camera.frustum.fov = Cesium.Math.PI_OVER_THREE;
    camera.frustum.near = 1.0;
    camera.frustum.far = 5000.0;

    var sdMap = new Cesium.ShadowMap({
        lightCamera: viewer.camera,
        isPointLight: true,

    });
}

function showChart(data) {
    var title = {
        text: '截面高程',
    };
    var chart = {
        type: 'line',
        backgroundColor: '#333'
    };
    var xAxis = {

    };
    var yAxis = {
        title: {
            text: '高程'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    };

    var tooltip = {
        valueSuffix: 'm'
    }

    var legend = {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    };

    var series = [{
        name: '截面高程',
        data: data
    }];

    var json = {};

    json.title = title;
    title.style = {
        color: '#ffffff',
        fontSize: "20px",
        fontWeight: "blod",
        fontFamily: "Courier new"
    }
    json.xAxis = xAxis;
    json.yAxis = yAxis;
    json.tooltip = tooltip;
    //json.legend = legend;
    json.series = series;
    json.chart = chart;


    json.credits = {
        text: 'Example.com',
        href: 'http://www.example.com',
        enabled: false
    };
    $("#chartTable").show();


    $('#chartTable').highcharts(json);
}
var videoElement = document.getElementById('trailer');


function cover() {

    var greenPolygon = viewer.entities.add({
        name: 'Green extruded polygon',
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(
                [114.44007, 30.46918,
                    114.44624, 30.46918,
                    114.44624, 30.47614,
                    114.44007, 30.47614
                ]),

            material: videoElement,

        }
    });
}


function getMessage() {
    $.ajax({
        async: false,
        cache: false,
        timeout: 1000,
        url: "http://bhm.bsri.com.cn:7028/ashx/PointInfoHandler.ashx?action=getpointinfo&BridgeId=8&PointId=1",
        type: "get",
        success: function(data) {

            var obj = eval('(' + data + ')');
            console.log(obj);
            // var pinBuilder = new Cesium.PinBuilder();

            // var questionPin = viewer.entities.add({
            //     name: 'mark',
            //     position: [110, 30, 20],
            //     billboard: {
            //         image: pinBuilder.fromText(10, Cesium.Color.BLACK, 48).toDataURL(),
            //         verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            //     }
            // });


        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $.Pop(XMLHttpRequest.status, 'alert')
                //alert(XMLHttpRequest.status);
            $.Pop(XMLHttpRequest.readyState, 'alert')
                //alert(XMLHttpRequest.readyState);
            $.Pop(textStatus, 'alert')
                //alert(textStatus);
        }
    });
}

function startTWF() {
    $("#baseHeightSet").show();

}

function setTWF() {
    var t = $("#test").val();
    setBaseHeight = t;
    createVolumeClicked();
}

function startWAA() {
    $("#watchableSet").show();

}

function setWAA() {

    watchableSettings.maxLength = parseFloat($("#radius").val());
    watchableSettings.height = parseFloat($("#height").val());
    watchableSettings.perAngle = parseFloat($("#deltaAngle").val());
    watchableSettings.perLength = parseFloat($("#deltaLength").val());
    console.log(watchableSettings);
    watchable();
}
//为标注文字取点
function getLabelPoint() {
    createHandler.setInputAction(getLabelPointEvent, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}



function diableGetPointForLabel() {
    createHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}
var labelPoint;


//标注点
function getPointToLabel() {
    createHandler.setInputAction(drawPoint, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}



function diableGetPointToLabel() {
    createHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}
var labelPoint;

function drawPoint(doubleClick) {
    var cartesian = viewer.scene.pickPosition(doubleClick.position);
    var pinBuilder = new Cesium.PinBuilder();
    var labelName = "点标记" + EntityOptions.length;
    var pinEntity = {
        id: labelName,

        position: cartesian,
        billboard: {
            image: pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 30).toDataURL(),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        }
    };

    var temp = viewer.entities.add(pinEntity);
    EntityOptions.push(pinEntity);

    addzNodes({
        LABEL: [{
                name: labelName,
                option: pinEntity,
                type: "LABEL"
            },

        ],
    });


    lastEntityID.push(temp.id);
    diableGetPointToLabel();
}

function getLabelPointEvent(doubleClick) {

    // var cartesian = viewer.scene.pickPosition(doubleClick.position);
    // labelPoint = ellipsoid.cartesianToCartographic(cartesian);
    var cartesian;
    if (viewer.scene.pick(doubleClick.position) != undefined)
        cartesian = viewer.scene.pickPosition(doubleClick.position);
    else
        cartesian = viewer.camera.pickEllipsoid(doubleClick.position, viewer.scene.globe.ellipsoid);
    var labelPoint = ellipsoid.cartesianToCartographic(cartesian);
    console.log(labelPoint);
    var lng_label = labelPoint.longitude;
    var lat_label = labelPoint.latitude;
    var height_label = labelPoint.height
    $("#lng_label").val(Cesium.Math.toDegrees(lng_label));
    $("#lat_label").val(Cesium.Math.toDegrees(lat_label));
    $("#height_label").val(height_label);
    diableGetPointForLabel();
}

function addTextLabel() {

    var labelPointInput = new Cesium.Cartographic(Cesium.Math.toRadians(parseFloat($("#lng_label").val())), Cesium.Math.toRadians(parseFloat($("#lat_label").val())), parseInt($("#height_label").val()) + 1);
    console.log(labelPointInput);
    var position = Cesium.Ellipsoid.WGS84.cartographicToCartesian(labelPointInput);
    var labelName = "文字标记" + EntityOptions.length;
    var options = {
        id: labelName,
        label: {
            show: true,
            showBackground: true,
            font: '20px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(15, 0),
            text: $("#text_label").val()
        },
        position: position

        //position: Cesium.Cartesian3.fromRadians(parseInt($("#lng_label").val()), parseInt($("#lat_label").val()), parseInt($("#height_label").val()) + 10),
    }
    var entity = viewer.entities.add(options);

    addzNodes({
        LABEL: [{
                name: labelName,
                option: options,
                type: "LABEL"
            },

        ],
    });


    EntityOptions.push(options);

    lastEntityID.push(entity.id);
}