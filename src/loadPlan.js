ipc.on('selected-plan-file', function(event, filePath) {



    var dirName = path.dirname(filePath[0]);
    var fileName = path.basename(filePath[0]);
    addPlan(dirName + "/" + fileName);

})


function selectPlan() {

    ipc.send('open-plan-file-dialog');

    return;

}

function addPlan(url) {


    var promise = Cesium.GeoJsonDataSource.load(url);
    promise.then(function(dataSource) {
        viewer.dataSources.add(dataSource);

        //Get the array of entities
        var entities = dataSource.entities.values;

        var colorHash = {};
        for (var i = 0; i < entities.length; i++) {
            //For each entity, create a random color based on the state name.
            //Some states have multiple entities, so we store the color in a
            //hash so that we use the same color for the entire state.
            var entity = entities[i];
            var name = entity.properties.name;
            var done = entity.properties.done._value;


            if (done == false) {

                entity.polygon.material = Cesium.Color.YELLOW.withAlpha(0.5)

            } else {
                entity.polygon.material = Cesium.Color.RED.withAlpha(0.5)
            }


            entity.polygon.outline = false;


            entity.polygon.extrudedHeight = 10;




        }
    }).otherwise(function(error) {
        //Display any errrors encountered while loading.
        // window.alert(error);
        console.log(error);
    });

}