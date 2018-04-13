const ipc = require('electron').ipcRenderer
const path = require('path');

ipc.on('selected-model-file', function(event, filePath) {
    var dirName = path.dirname(filePath[0]);
    var fileName = path.basename(filePath[0]);
    addModel("file:/" + dirName + "/" + fileName, 100, true);
    addOPModelToTree("file:/" + dirName + "/" + fileName, 0, true);



})

ipc.on('saved-file', function(event, path) {
    var newjsondata = JSON.stringify(jsondata);
    var fs = require('fs');
    fs.writeFile(path, newjsondata, (err) => {
        if (err) throw err;
        $.Pop('保存成功', 'alert')
    });

})

function AddMultiModel() {
    ipc.send('open-multiModels');
}

ipc.on('multiModels-opened', function(event, filePath, deltaH, index) {

    console.log(filePath);
    console.log(deltaH);
    if (index == 10)
        addModel(filePath, deltaH, true);
    else
        addModel(filePath, deltaH, false);

})

function selectModel() {
    ipc.send('open-model-file-dialog');
    return;
}

//保存工程
function saveEngineering() {
    ipc.send('save-dialog');
    return;
}


function addOPModelToTree(path1, deltaH, flyTo) {
    var newjsondata = {
        "倾斜摄影模型": [
            { name: path1, url: path1, type: "OPMODEL" },

        ],

    };

    addzNodes(newjsondata);
}

var allPrimitives = [];

function addModel(path1, deltaH, flyTo) {
    console.log(path1 + " " + deltaH);

    var heightStyle = new Cesium.Cesium3DTileStyle({
        color: {
            conditions: [
                ["${height} >= 300", "rgba(45, 0, 75, 0.5)"],
                ["${height} >= 200", "rgb(102, 71, 151)"],
                ["${height} >= 100", "rgb(170, 162, 204)"],
                ["${height} >= 50", "rgb(224, 226, 238)"],
                ["${height} >= 25", "rgb(252, 230, 200)"],
                ["${height} >= 10", "rgb(248, 176, 87)"],
                ["${height} >= 5", "rgb(198, 106, 11)"],
                ["true", "rgb(127, 59, 8)"]
            ]
        }
    });
    var defaultStyle = new Cesium.Cesium3DTileStyle({
        color: "color('white')",
        show: true
    });
    var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({

        url: path1,
        //loadSiblings: true,
        // debugShowGeometricError: true,
        maximumScreenSpaceError: 2,
        dynamicScreenSpaceError: true
    }));

    allPrimitives.push(tileset);

    tileset.readyPromise.then(function() {


        var boundingSphere = tileset.boundingSphere;


        var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);

        //坐标位置转换
        var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
        var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, deltaH);
        // var offset = Cesium.Cartesian3.fromRadians(110, 30, 0);

        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());


        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);





        if (flyTo) {
            viewer.camera.flyToBoundingSphere(tileset.boundingSphere);
            viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
            viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo) {
                // Fly to custom position
                viewer.camera.flyToBoundingSphere(tileset.boundingSphere);

                // Tell the home button not to do anything
                commandInfo.cancel = true;
            });
        }
        //  tileset.style = defaultStyle;

        // addtolayer("OPMODEL",{});

    }).otherwise(function(error) {
        throw (error);
    });
}

function loadMutiGLB() {
    //loadGLB('././addData/1/wuhuangqiao.gltf', Cesium.Cartesian3.fromDegrees(114.44291, 30.47113, 10));
    loadGLB('././addData/1/yingwuqiao1.gltf', Cesium.Cartesian3.fromDegrees(114.22309, 30.49846, 50));

}

function loadGLB(url, position) {

    var height = 0;

    var pitch = Cesium.Math.toRadians(0);
    var roll = 0; //Cesium.Math.toRadians(-90);
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
    var scene = viewer.scene;
    //创建坐标  
    var coord = position;
    //创建一个东（X，红色）北（Y，绿色）上（Z，蓝色）的本地坐标系统  
    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(coord);
    // 改变3D模型的模型矩阵，可以用于移动物体  
    // 物体的世界坐标 = 物体的模型坐标 * 世界矩阵  

    var gltfModel = Cesium.Model.fromGltf({ //异步的加载模型  
        url: url,
        modelMatrix: modelMatrix, //模型矩阵  
        scale: 1.0 //缩放  
    });
    // gltfModel.colorBlendAmount = 1;
    // var gao04 = gltfModel.getMaterial("gao04");
    // gao04.setValue('shininess', 256.0);
    var model = scene.primitives.add(gltfModel);
    console.log(gltfModel);



}

function loadBIM() {
    var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'https://beta.cesium.com/api/assets/1459?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNjUyM2I5Yy01YmRhLTQ0MjktOGI0Zi02MDdmYzBjMmY0MjYiLCJpZCI6NDQsImFzc2V0cyI6WzE0NTldLCJpYXQiOjE0OTkyNjQ3ODF9.SW_rwY-ic0TwQBeiweXNqFyywoxnnUBtcVjeCmDGef4'
    }));

    tileset.readyPromise.then(function() {
        var boundingSphere = tileset.boundingSphere;
        viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0.5, -0.2, boundingSphere.radius * 4.0));
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }).otherwise(function(error) {
        throw (error);
    });

}

function deletePrimitiveByUrl(url) {
    console.log(allPrimitives);

    for (var i = 0; i < allPrimitives.length; i++) {
        var tileset = allPrimitives[i];

        console.log(url);

        console.log(tileset._tilesetUrl);
        if (tileset._tilesetUrl == url) {
            viewer.scene.primitives.remove(tileset);
        }
    }
}

function flyToPrimitiveByUrl(url) {
    console.log(allPrimitives);

    for (var i = 0; i < allPrimitives.length; i++) {
        var tileset = allPrimitives[i];

        console.log(url);

        console.log(tileset._tilesetUrl);
        if (tileset._tilesetUrl == url) {
            viewer.camera.flyToBoundingSphere(tileset.boundingSphere);
        }
    }
}

function loadProject(json) {
    var opModels = json["倾斜摄影模型"];

    for (var i = 0; i < opModels.length; i++)
        addModel(opModels[i].url, 0, true);


    var labels = json["地图标注"];
    for (var i = 0; i < labels.length; i++) {
        var entity = viewer.entities.add(labels[i].option);
        EntityOptions.push(labels[i].option);
    }

}