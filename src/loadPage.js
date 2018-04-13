ipc.on('selected-page-file', function(event, filePath) {



    var dirName = path.dirname(filePath[0]);
    var fileName = path.basename(filePath[0]);
    addPage(dirName + "/" + fileName);

})


function selectPage() {

    ipc.send('open-page-file-dialog');

    return;

}

function changePage(url) {
    // document.getElementById('sensorContentFrame').src = url;

    $(".messageBox").show();

}

function addPage(url) {
    var promise = Cesium.GeoJsonDataSource.load(url);
    var pinBuilder = new Cesium.PinBuilder();
    var iframe = document.getElementsByClassName('cesium-infoBox-iframe')[0];
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');

    promise.then(function(dataSource) {
        var entities = dataSource.entities.values;

        var bluePin;

        document.getElementById("tablebody").innerHTML = "";

        for (var i = 0; i < entities.length; i++) {

            var entity = entities[i];
            var name = entity.properties.name;
            var url = entity.properties.url._value;


            var type = entity.properties.type._value;

            var pinEntity = {
                id: entity.properties.url._value,
                name: name,
                description: entity.properties.url._value,
                position: entity.position._value,
                billboard: {
                    //image: pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL(),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    image: './img/sensor/' + type + '.png',
                    //sizeInMeters: true


                }
            };
            viewer.entities.removeById(entity.properties.url._value);
            // if (viewer.entities.contains(pinEntity) === false)
            bluePin = viewer.entities.add(pinEntity);

        }
        $(".messageBox").show();


        function obj(index, eve, id) {

            this.get = function() {

                return '<tr><td>' + index + '</td> <td>' + eve.properties.name._value + '</td> <td><button type="button" class="btn btn-default" onClick="flyto(this.value)" value="' + eve.properties.url._value + '">跳转</button></td>  </tr>';
            }
        }



        for (var i = 0; i < entities.length; i++) {
            var new_obj = new obj(i, entities[i], entities[i].id);

            var line = new_obj.get();
            document.getElementById("tablebody").innerHTML += (line);

        }

        FoucusOnSensor();

    }).otherwise(function(error) {
        //Display any errrors encountered while loading.
        console.log(error);
    });
}


function FoucusOnSensor() {
    var createHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    createHandler.setInputAction(GetSensorMessage, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function CloseSensorPage() {
    $(".messageBox").hide();
    createHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function GetSensorMessage(click) {


    var test = viewer.selectedEntity;
    //  console.log(test._description._value);
    if (test._description._value != undefined) {
        if (test._description._value.indexOf("HealthMonitor") >= 0 || test._description._value.indexOf("RoutineIns") >= 0) {
            Win10.openUrl(test._description._value, test._name._value, [
                ['800px', '450px'],
                ['350px', '50px']
            ]);
            changePage(test._description._value);
        }
        if (test._description._value.indexOf("720yuntu") >= 0) {
            Win10.openUrl(test._description._value, test._name._value, [
                ['100%', '90%'],
                ['0px', '0px']
            ]);
            changePage(test._description._value);
        }
        if (test._description._value.indexOf("video") >= 0) {
            Win10.openUrl(test._description._value, test._name._value, [
                ['50%', '50%'],
                ['0px', '0px']
            ]);
            changePage(test._description._value);
        }
    }


}


function flyto(obj) {

    var entitys = viewer.entities.values;

    for (var i = 0; i < entitys.length; i++) {
        var entity = entitys[i];

        if (obj === entity._id) {
            if (entity.id.indexOf('720yuntu') >= 0) {
                viewer.flyTo(entity);
                console.log(entity);
                Win10.openUrl(entity._description._value, entity._name._value, [
                    ['100%', '90%'],
                    ['0px', '0px']
                ]);

                changePage(entity._description._value);
                return;
            } else {
                viewer.flyTo(entity);
                console.log(entity);
                Win10.openUrl(entity._description._value, entity._name._value, [
                    ['800px', '450px'],
                    ['350px', '50px']
                ]);

                changePage(entity._description._value);
            }
        }
    }

}