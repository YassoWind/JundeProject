//初始json数据
var jsondata = {
    OPMODEL: [],
    BIMMODEL: [],
    MARK: [],
    LABEL: [],
};

//清除默认鼠标右击事件
document.oncontextmenu = function() {
    return false;
}

//ztree代码
var setting = {
    check: {
        enable: true
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onMouseDown: onMouseDown,
        onCheck: onCheck
    }
};

// var zNodes = [
//     {name: "父节点1", id:"3",children: [{ name: "子节点1" },{ name: "子节点2" }]},
//     {name:"zhangsan", id:"3",children: [{name: "北四环第1标段",url: "didi"},{name: "北四环第2标段",url: "didi"}]},
//     {name:"lisi", id:"4",children: [{name: "二号桥设计模型",url: "didi"},{name: "三号桥设计模型",url: "didi"}]}   
// ];

//将json数据解析成树结构方法
function changeztree(json) {
    var data = [];
    for (var i in json) {
        var jsonlist = {};
        jsonlist.name = i;
        jsonlist.children = json[i]
        jsonlist.open = true;
        data.push(jsonlist)
    }
    return data;
}


var code;

function setCheck() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        py = $("#py").attr("checked") ? "p" : "",
        sy = $("#sy").attr("checked") ? "s" : "",
        pn = $("#pn").attr("checked") ? "p" : "",
        sn = $("#sn").attr("checked") ? "s" : "",
        type = { "Y": py + sy, "N": pn + sn };
    zTree.setting.check.chkboxType = type;
    showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
}

function showCode(str) {
    if (!code) code = $("#code");
    code.empty();
    code.append("<li>" + str + "</li>");
}

//鼠标右击事件
var ft = false;
var menu = document.getElementsByClassName("menu")[0];
var jump = document.getElementsByClassName("jump")[0];
var del = document.getElementsByClassName("del")[0];
var attr = document.getElementsByClassName("attr")[0];

function onMouseDown(event, treeId, treeNode) {
    if (event.button == 2) {
        var e = event || window.event;
        event.stopPropagation();
        // console.log(treeId);
        console.log(treeNode);
        if (treeNode) {
            menu.style.display = "block";
            menu.style.left = e.clientX + "px";
            menu.style.top = e.clientY + "px";
            ft = true;
        }
    }
    jump.onmousedown = function(event) {
        event.stopPropagation();
        // console.log(treeNode);
        flyTo(treeNode);

        menu.style.display = "none";
    }

    del.onmousedown = function(event) {
        event.stopPropagation();
        removezNodes(treeNode);

        // console.log(treeNode);
        menu.style.display = "none";
    }
    attr.onmousedown = function(event) {
        event.stopPropagation();
        // console.log(treeNode);
        menu.style.display = "none";
    }

}

//再次点击其他位置，则隐藏右键菜单
document.onmousedown = function() {
    if (ft) {
        ft = false;
        menu.style.display = "none";
    }
}


function count() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        checkCount = zTree.getCheckedNodes(true).length,
        nocheckCount = zTree.getCheckedNodes(false).length,
        changeCount = zTree.getChangeCheckedNodes().length;
    $("#checkCount").text(checkCount);
    $("#nocheckCount").text(nocheckCount);
    $("#changeCount").text(changeCount);

}

//check框oncheck事件
function onCheck(event, treeId, treeNode) {
    count();
    console.log(treeNode.name);
    console.log(treeNode.checked);
}

//生成左侧树形结构
function createTree(json) {
    var zNodes = changeztree(json)
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    count();
    clearFlag = $("#last").attr("checked");
}

// $(document).ready(function () {
//     createTree(jsondata)
//     $("#init").bind("change", createTree);
//     $("#last").bind("change", createTree);
// });



//添加分支
function addzNodes(json) {
    var newzNodes = {};
    for (var keyA in jsondata) {
        if (json[keyA] === undefined) {
            newzNodes[keyA] = jsondata[keyA];
        } else {
            newzNodes[keyA] = json[keyA]
        }
    }
    for (var keyB in json) {
        if (jsondata[keyB] === undefined) {
            newzNodes[keyB] = json[keyB];
        } else {
            newzNodes[keyB] = newzNodes[keyB].concat(jsondata[keyB])
        }
    }
    jsondata = newzNodes;
    newzNodes = changeztree(newzNodes);
    $.fn.zTree.init($("#treeDemo"), setting, newzNodes);
    return jsondata;
}

//删除分支 
function removezNodes(json) {
    if (json.type == "OPMODEL")
        deletePrimitiveByUrl(json.url);
    if (json.type == "LABEL")
        deleteLabelByID(json.name);
    if (json.type == "LCB")
        deleteLabelByID(json.name);
    if (json.type == "DLX")
        deleteLabelByID(json.name);
    if (json.type == "ZCQ")
        deleteLabelByID(json.name);
    if (json.type == "QM")
        deleteLabelByID(json.name);


    for (var i in jsondata) {
        if (json.name == i) {
            delete jsondata[i];
        }

        for (var j = 0; j < jsondata[i].length; j++) {
            if (json.name == jsondata[i][j].name) {
                console.log(jsondata[i][j])
                jsondata[i].splice(j, 1);
            }
        }
    }
    console.log(jsondata)
    var newznode22 = changeztree(jsondata)
    $.fn.zTree.init($("#treeDemo"), setting, newznode22);
    return jsondata;
}

//新建工程
function newEngineering() {
    var newjsondata = {
        OPMODEL: [],
        BIMMODEL: [],
        MARK: [],
        LABEL: []
    };
    //新建工程的初始json数据
    createTree(newjsondata)
    jsondata = newjsondata;
    return jsondata;
}


//打开工程
function openEngineering() {
    var files = document.getElementById('files').files;
    var file = files[0];
    var start = 0;
    var stop = file.size - 1;
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) {
            var content = evt.target.result;
            var objJson = JSON.parse(content);
            console.log(objJson);
            loadProject(objJson);

            createTree(objJson);
        } else {

        }
    };
    var blob = file.slice(start, stop + 1);
    reader.readAsText(file);
}

newEngineering();



//头部hover事件
$(".header-title2").eq(0).hover(function(){
    $(".engineering_ul").eq(0).show();
},function(){
    $(".engineering_ul").eq(0).hide();
})


$(".header-title2").eq(1).hover(function(event){
    $(".map_ul").eq(0).show();
},function(){
    $(".map_ul").eq(0).hide();
})


$(".header-title2").eq(2).hover(function(event){
    $(".model_ul").eq(0).show();
},function(){
    $(".model_ul").eq(0).hide();
})


$(".header-title2").eq(3).hover(function(event){
    $(".mark_ul").eq(0).show();
},function(){
    $(".mark_ul").eq(0).hide();
})


$(".header-title2").eq(4).hover(function(event){
    $(".treeD_ul").eq(0).show();
},function(){
    $(".treeD_ul").eq(0).hide();
})


$(".header-title2").eq(5).hover(function(event){
    $(".mapMark_ul").eq(0).show();
},function(){
    $(".mapMark_ul").eq(0).hide();
})

