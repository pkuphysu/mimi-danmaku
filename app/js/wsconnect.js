const danmakuController = require("./harmony");
const { config } = require("./utils");
const mainWindow = require("./mainwindow");

class WebSocketController {
	constructor() {
		this.ws = null;
		this.harmony = danmakuController;

		setInterval(() => {
			if (this.ws) this.ws.send("ping");
		}, 30000);
	}

	wsinit() {
		this.ws = new WebSocket(config.server, "danmaku" + config.channel);

		this.ws.onopen = function() {
			ipcRenderer.send("show-message", "系统消息：建立连接成功");
		}
		// Bind this
		this.ws.onmessage = event => {
			const msg = JSON.parse(event.data);
			if (!msg.meta) return;
			if (msg.from !== "user") return;
			this.harmony.insert(msg);
		}

		this.ws.onerror = function() {
			ipcRenderer.send("show-message", "系统消息：连接失败，请手动关闭窗口并稍后再试");
		}

		mainWindow.send("setchannel", config);
	}

	wsreload() {
		//if (getChannel() === currentChannel) return;
		if (this.ws) this.ws.close();
		this.wsinit();
	}
}

module.exports = new WebSocketController();
