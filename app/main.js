// Modules to control application life and create native browser window
const { app, ipcMain, BrowserWindow, TouchBar, dialog, screen } = require("electron");

const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;
require("@electron/remote/main").initialize();

function createPanel() {

	const panelWindow = new BrowserWindow({
		width         : 1200,
		minWidth      : 1200,
		height        : screen.getPrimaryDisplay().workAreaSize.height * 0.8,
		minHeight     : 400,
		fullscreenable: false,
		title         : "Mimi Danmaku Panel",
		webPreferences: {
			nodeIntegration : true,
			contextIsolation: false
		}
	});

	require("@electron/remote/main").enable(panelWindow.webContents);

	panelWindow.loadFile("app/panel.html");

	const touchBar = new TouchBar({
		items: [
			new TouchBarButton({
				label: "撤回所有弹幕",
				backgroundColor: "#c82333",
				click: () => {
					panelWindow.webContents.send("denyall");
				}
			})
		]
	});
	panelWindow.setTouchBar(touchBar);

	//panelWindow.setPosition(0, 0, true);

	panelWindow.on("close", async e => {

		if (BrowserWindow.getAllWindows().length > 1) {
			e.preventDefault();
			dialog.showMessageBox({
				type: "warning",
				title: "[Warning]",
				message: "弹幕窗口处于开启状态，无法退出控制面板！"
			});
		}
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createPanel();

	app.on("activate", function() {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createPanel();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function() {
	if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;

ipcMain.on("show-message", (event, message) => {
	dialog.showMessageBox({
		message
	});
});
