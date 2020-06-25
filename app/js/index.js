const { ipcRenderer } = require("electron");
const mainWindow = require('./js/mainwindow');
const webSocketController = require('./js/wsconnect');
const danmakuController = require('./js/harmony');
const { panelSubmit, about } = require('./js/settings');

const MimiDanmaku = {
    mainWindow,
    ws: webSocketController,
    danmaku: danmakuController,
    panelSubmit,
    about
}

ipcRenderer.on("denyall", () => {
    MimiDanmaku.danmaku.denyAll();
});
