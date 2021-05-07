const { BrowserWindow, screen } = require("@electron/remote");
const { config } = require("./utils");

class MainWindowController {
	constructor() {
		this.window = null;
	}
	// Create the browser window.
	createWindow(options) {

		let fullScreen = true, onTop = "main-menu", backgroundImage = false;

		if (options[0] === 1) fullScreen = false;
		if (options[1] === 1) onTop = "floating";
		if (options[2] === 1 && !fullScreen) backgroundImage = true;

		if (fullScreen) {
			let config = {
				transparent: true,
				frame: false,
				toolbar: false,
				title: "Mimi Danmaku",
				webPreferences: {
					nodeIntegration : true,
					contextIsolation: false
				}
			};
			let displays = screen.getAllDisplays();
			let externalDisplay = displays.find(display => {
				return display.bounds.x !== 0 || display.bounds.y !== 0;
			});
			if (externalDisplay && confirm("是否要在外部屏幕打开弹幕窗口？")) {
				this.window = new BrowserWindow({
					...config,
					x: externalDisplay.bounds.x,
					y: externalDisplay.bounds.y,
					width: externalDisplay.workAreaSize.width,
					height: externalDisplay.workAreaSize.height
				});
			} else {
				this.window = new BrowserWindow({
					...config,
					width: screen.getPrimaryDisplay().workAreaSize.width - 3,
					height: screen.getPrimaryDisplay().workAreaSize.height - 2
				});
			}

			this.window.setIgnoreMouseEvents(true);
			//app.dock.hide();
			this.window.setAlwaysOnTop(true, onTop); //normal, floating, torn-off-menu, modal-panel, /* keynote and dock */, main-menu, status, pop-up-menu, screen-saver
			//this.window.setVisibleOnAllWorkspaces(true);
			//this.window.setFullScreenable(false);
			//this.window.setMenu(null);
		} else {
			this.window = new BrowserWindow({
				width: 800,
				minWidth: 400,
				height: 600,
				minHeight: 400,
				transparent: !backgroundImage,
				frame: true,
				title: "Mimi Danmaku",
				webPreferences: {
					nodeIntegration : true,
					contextIsolation: false
				}
			});
		}

		// and load the index.html of the app.
		this.window.loadFile("app/index.html");

		this.window.webContents.on("did-finish-load", () => {
			this.send("background", backgroundImage);
			this.send("setchannel", config);
		});

		this.window.on("closed", () => {
			document.getElementById("submit").innerHTML = "开启弹幕窗口";
			document.getElementById("submit").classList.replace("btn-danger", "btn-primary");
			this.window = null;
		});
	}

	closeWindow() {
		this.window.close();
		this.window = null;
	}

	send(...args) {
		if (this.window) Reflect.apply(this.window.webContents.send, this, args);
	}
}

module.exports = new MainWindowController();
