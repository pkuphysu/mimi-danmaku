const mainWindow = require('./js/mainwindow');
const WebSocketController = require('./js/wsconnect');
const danmakuController = require('./js/harmony');
const { panelSubmit, about } = require('./js/settings');

const MimiDanmaku = {
    mainWindow,
    ws: new WebSocketController(),
    danmaku: danmakuController,
    panelSubmit,
    about
}
