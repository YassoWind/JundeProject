// 载入electron模块
const electron = require("electron");
// 控制应用生命周期的模块  
const { app } = electron;
// 创建本地浏览器窗口的模块  
const { BrowserWindow } = electron;
const path = require('path');
// 指向窗口对象的一个全局引用，如果没有这个引用，那么当该javascript对象被垃圾回收的  
// 时候该窗口将会自动关闭  
let win;

let UserName;



function createWindow() {
    // 创建一个新的浏览器窗口  
    //  win = new BrowserWindow({ fullscreen: true });
    win = new BrowserWindow({ width: 1920, height: 1080 });

    // 并且装载应用的index.html页面  
    // win.loadURL(`http://localhost:8080/1.html`);
    win.loadURL(`file://${__dirname}/index.html`);
    //win.loadURL(`file://${__dirname}/index.1.html`);
    // win.loadURL(`file://${__dirname}/demo.html`);

    // 打开开发工具页面  
    //win.webContents.openDevTools();

    // 当窗口关闭时调用的方法  
    win.on('closed', () => {

        // 解除窗口对象的引用，通常而言如果应用支持多个窗口的话，你会在一个数组里  
        // 存放窗口对象，在窗口关闭的时候应当删除相应的元素。  
        win = null;
    });




}

// 当Electron完成初始化并且已经创建了浏览器窗口，则该方法将会被调用。  
// 有些API只能在该事件发生后才能被使用。  
app.on('ready', createWindow);
/* var mainWindow = new BrowserWindow({ 
  webPreferences: { 
    nodeIntegration: false 
  } 
}); */
// 当所有的窗口被关闭后退出应用  
app.on('window-all-closed', () => {
    // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出  


    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // 对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他  
    // 窗口打开  
    if (win === null) {
        createWindow();
    }
});

const { ipcMain } = require('electron')
//监听web page里发出的message


ipcMain.on('sendPoints', (event, arg) => {

    var fs = require('fs');
    // 添加数据
    // fs.appendFile('test.txt', arg, function(err) {
    //     if (err) throw err;
    //     //console.log(arg);
    // });
    fs.writeFile('test.txt', arg, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });

});
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

ipc.on('open-model-file-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (files) {
        if (files) event.sender.send('selected-model-file', files)
    })
});


ipc.on('save-dialog', function (event) {
    const options = {
      title: '保存工程',
      filters: [
        { name: 'json格式', extensions: ['json'] }
      ]
    }
    dialog.showSaveDialog(options, function (filename) {
      event.sender.send('saved-file', filename)
    })
})


ipc.on('open-plan-file-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (files) {
        if (files) event.sender.send('selected-plan-file', files)
    })
});

ipc.on('open-label-file-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (files) {
        if (files) event.sender.send('selected-label-file', files)
    })
})

ipc.on('open-route-file-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (files) {
        if (files) event.sender.send('selected-route-file', files)
    })
})


ipc.on('open-page-file-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (files) {
        if (files) event.sender.send('selected-page-file', files)
    })
})
var data;
ipcMain.on('open-multiModels', (event, arg) => {

    var fs = require('fs');
    var data = JSON.parse(fs.readFileSync('./data.json'));

    for (let index = 0; index < data.length; index++) {
        //setTimeout(function() { event.sender.send('multiModels-opened', data[index].path, data[index].deltaH) }, 1000);
        event.sender.send('multiModels-opened', data[index].path, data[index].deltaH, index);
    }
});

function addOne(index) {
    console.log(index);
    // event.sender.send('multiModels-opened', data[index].path, data[index].deltaH)
}




ipcMain.on('savePNG', (event, arg) => {
    var fs = require('fs');
    var imgData = arg;
    //过滤data:URL

    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    // var base64Data = imgData.replace("data:image/png;base64,", "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile("out.png", dataBuffer, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("ok");
        }
    });

});


ipcMain.on('loading-labels', (event, arg) => {

    var fs = require('fs');
    var data = JSON.parse(fs.readFileSync('./label.json'));

    event.sender.send('loaded-labels', data);

});
ipcMain.on('save-labels', (event, arg) => {

    var fs = require('fs');

    fs.writeFile('./label.json', arg, (err) => {
        if (err) throw err;
        console.log('The label has been saved!');
    });

});




