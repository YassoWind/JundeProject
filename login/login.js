//定义HTTP连接对象
var xmlHttp;

//实例化HTTP连接对象
function createXmlHttpRequest() {
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
}
var name;
//发起登录请求
function login() {
    createXmlHttpRequest();
    name = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (name == null || name == "") {
        innerHtml("请输入用户名");
        return;
    }
    if (password == null || password == "") {
        innerHtml("请输入密码");
        return;
    }
    var url = "http://118.190.176.21:6688/JundeLogin/" + name + "/" + password;
    xmlHttp.open("GET", url, true);
    xmlHttp.onreadystatechange = handleResult;
    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlHttp.send("");
    //handleResult();
}

//处理服务器返回的结果/更新页面
function handleResult() {


    //window.location.href = '../index.html';
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var response = xmlHttp.responseText;
        domParser = new DOMParser();
        xmlDoc = domParser.parseFromString(response, 'text/xml');

        var elements = xmlDoc.getElementsByTagName("int");
        if (elements[0].innerHTML == 1) {
            window.location.href = '../index.html';


            ipc.send('UserLogin', name);

        } else if (elements[0].innerHTML == 2)
            innerHtml("密码错误");
        else if (elements[0].innerHTML == 3)
            innerHtml("账号不存在");

        else if (elements[0].innerHTML == 4) {
            innerHtml("账号已过期");
        } else {
            innerHtml("系统错误");
        }
    }


}

//插入提示语
function innerHtml(message) {
    document.getElementById("tip").innerHTML = "<span style='font-size:12px; color:red;'>" + message + "</span>";
}