ipc.on('selected-label-file', function(event, filePath) {



    var dirName = path.dirname(filePath[0]);
    var fileName = path.basename(filePath[0]);
    addLabel(dirName + "/" + fileName);

})


function selectLabel() {

    ipc.send('open-label-file-dialog');

    return;

}

function addLabel(url) {

    $(".messageBox").hide();
    var promise = Cesium.GeoJsonDataSource.load(url);
    var pinBuilder = new Cesium.PinBuilder();
    var iframe = document.getElementsByClassName('cesium-infoBox-iframe')[0];
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
    promise.then(function(dataSource) {
        //viewer.dataSources.add(dataSource);
        var entities = dataSource.entities.values;

        var bluePin;
        document.getElementById("tablebody").innerHTML = "";


        for (var i = 0; i < entities.length; i++) {

            var entity = entities[i];
            var name = entity.properties.name;
            var url = entity.properties.url._value;
            var type = entity.properties._type._value;
            console.log(entity.properties);


            var pinBuilder = new Cesium.PinBuilder();
            bluePin = viewer.entities.add({
                name: name,
                description: url,
                position: entity.position._value,
                billboard: {
                    image: './img/sensor/CAM.png',
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,

                }
            });
        }
        $(".messageBox").show();


        function obj(index, eve, id) {

            this.get = function() {

                return '<tr><td>' + index + '</td> <td>' + eve.properties.name._value + '</td> <td><button type="button" class="btn btn-default" onClick="flytoLabel(this.value)" value="' + eve.properties.url._value + '">跳转</button></td>  </tr>';
            }
        }



        for (var i = 0; i < entities.length; i++) {
            var new_obj = new obj(i, entities[i], entities[i].id);

            var line = new_obj.get();
            document.getElementById("tablebody").innerHTML += (line);

        }
        //viewer.zoomTo(bluePin);
        FoucusOnVideo();
    }).otherwise(function(error) {
        //Display any errrors encountered while loading.
        console.log(error);
    });
}

function FoucusOnVideo() {
    var createHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    createHandler.setInputAction(GetVideoMessage, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function GetVideoMessage(click) {


    var test = viewer.selectedEntity;
    console.log(test);
    if (test._description._value != undefined) {
        console.log(test._description._value);
        var videoElement = document.getElementById('trailer');
        videoElement.style.display = '';
        videoElement.src = test._description._value;
    }


}

function flytoLabel(obj) {

    var entitys = viewer.entities.values;

    for (var i = 0; i < entitys.length; i++) {
        var entity = entitys[i];
        // console.log(entity._description._value);
        // console.log(obj);
        if (obj === entity._description._value) {

            var test = viewer.selectedEntity;

            if (entity._description != undefined) {
                console.log(entity._description._value);
                var videoElement = document.getElementById('trailer');
                videoElement.style.display = '';
                videoElement.src = entity._description._value;
                viewer.flyTo(entity);

            }
        }
    }

}