const path = require("path");
const url = require("url");

// Create the browser window.
function createWindow() {

	var fullScreen = true, onTop = "main-menu", backgroundImage = false;

	if (options[0] == 1) fullScreen = false;
	if (options[1] == 1) onTop = "floating";
	if (options[2] == 1 && !fullScreen) backgroundImage = true;

	if (fullScreen) {
		let config = {
			transparent   : true,
			frame         : false,
			toolbar       : false,
			resizable     : true,
			//alwaysOnTop   : true,
			title         : "Mimi Danmaku",
			webPreferences: {
				nodeIntegration: true
			}
		};
		let displays = electron.screen.getAllDisplays();
		let externalDisplay = displays.find(display => {
			return display.bounds.x !== 0 || display.bounds.y !== 0;
		});
		if (externalDisplay && confirm("是否要在外部屏幕打开弹幕窗口？")) {
			mainWindow = new BrowserWindow(Object.assign(config, {
				x     : externalDisplay.bounds.x,
				y     : externalDisplay.bounds.y,
				width : externalDisplay.workAreaSize.width,
				height: externalDisplay.workAreaSize.height
			}));
		} else {
			mainWindow = new BrowserWindow(Object.assign(config, {
				width : electron.screen.getPrimaryDisplay().workAreaSize.width,
				height: electron.screen.getPrimaryDisplay().workAreaSize.height
			}));
		}

		mainWindow.setIgnoreMouseEvents(true);
		//app.dock.hide();
		mainWindow.setAlwaysOnTop(true, onTop); //normal, floating, torn-off-menu, modal-panel, /* keynote and dock */, main-menu, status, pop-up-menu, screen-saver
		//mainWindow.setVisibleOnAllWorkspaces(true);
		//mainWindow.setFullScreenable(false);
		//mainWindow.setMenu(null);
	} else {
		mainWindow = new BrowserWindow({
			width         : 800,
			minWidth      : 400,
			height        : 600,
			minHeight     : 400,
			transparent   : !backgroundImage,
			frame         : true,
			title         : "Mimi Danmaku",
			webPreferences: {
				nodeIntegration: true
			}
		});
	}

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, "index.html"),
		protocol: "file:",
		slashes : true
	}));

	mainWindow.webContents.on("did-finish-load", () => {
		mainWindow.webContents.send("background", backgroundImage);
		mainWindow.webContents.send("setchannel", getChannel());
	});

	mainWindow.on("closed", () => {
		document.getElementById("submit").innerHTML = "开启弹幕窗口";
		document.getElementById("submit").classList.remove("btn-danger");
		document.getElementById("submit").classList.add("btn-primary");
		mainWindow = null;
	});
}

function closeWindow() {
	mainWindow.close();
	mainWindow = null;
}
