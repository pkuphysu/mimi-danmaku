const { dialog } = require("electron").remote;
const danmakuController = require('./harmony');
const { getChannel } = require("./utils");
const mainWindow = require('./mainwindow');

const {
	server = "ws://localhost:9000",
	rule = "",
	channel = "default"
} = require("../config.json");

class WebSocketController {
	constructor() {
		this.ws = null;
		this.currentChannel = "default"
		this.harmony = danmakuController;

		setInterval(() => {
			if (this.ws) this.ws.send("ping");
		}, 30000);
	}

	wsinit(server, channel) {
		this.ws = new WebSocket(server, "danmaku" + channel);

		this.ws.onopen = function() {
			dialog.showMessageBox({
				message: "系统消息：建立连接成功"
			});
		}
		// Bind this
		this.ws.onmessage = event => {
			const msg = JSON.parse(event.data);
			if (!msg.meta) return;
			if (msg.from !== "user") return;
			this.harmony.insert(msg);
		}

		this.ws.onerror = function() {
			dialog.showMessageBox({
				message: "系统消息：连接失败，请手动关闭窗口并稍后再试"
			});
		}

		mainWindow.send("setchannel", channel);
	}

	wsreload() {
		//if (getChannel() === currentChannel) return;
		this.currentChannel = getChannel();
		if (this.ws) this.ws.close();
		this.wsinit(server, this.currentChannel);
	}
}

module.exports = WebSocketController;
