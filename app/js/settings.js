const electron = require("electron").remote;
const { dialog } = electron;
const mainWindow = require('./mainwindow');

const {
	server = "ws://localhost:9000",
	rule = "",
	channel = "default"
} = require("../config.json");

document.getElementById("rule").value = rule;
document.getElementById("channel").value = channel;

const options = [0, 0, 0, 0, 0];


window.addEventListener("beforeunload", event => {
	if (mainWindow.window) {
		const options = {
			type   : "warning",
			title  : "[Warning]",
			message: "弹幕窗口处于开启状态，无法退出控制面板！"
		};
		electron.dialog.showMessageBox(electron.getCurrentWindow(), options);
		event.returnValue = false;
	}
});

document.querySelectorAll(":not(td) > .btn-group").forEach((group, i) => {
	group.querySelectorAll("button").forEach((target, j) => {
		target.addEventListener("mouseover", event => {
			document.getElementById("help").innerHTML = event.target.dataset.help;
		});
		target.addEventListener("mouseout", event => {
			document.getElementById("help").innerHTML = "欢迎使用米米弹幕";
		});
		target.addEventListener("click", event => {
			changeOption(i, j);
		});
	});
});

function changeOption(i, j) {
	const targets = document.querySelectorAll(".btn-group")[i].querySelectorAll("button");
	targets.forEach(target => target.classList.remove("active"));
	targets[j].classList.add("active");
	options[i] = j;
	if (i === 0) {
		document.querySelectorAll(".row")[!j + 2].style.display = "none";
		document.querySelectorAll(".row")[j + 2].style.display = "";
	}
}

function panelSubmit() {
	if (mainWindow.window) {
		document.getElementById("submit").innerHTML = "开启弹幕窗口";
		document.getElementById("submit").classList.remove("btn-danger");
		document.getElementById("submit").classList.add("btn-primary");
		mainWindow.closeWindow();
	} else {
		document.getElementById("submit").innerHTML = "关闭弹幕窗口";
		document.getElementById("submit").classList.remove("btn-primary");
		document.getElementById("submit").classList.add("btn-danger");
		mainWindow.createWindow(options);
	}
}

function about() {
	dialog.showMessageBox({
		message: `Mimi Danmaku Ver ${require("../../package.json").version}\n\nWe are using Node.js ${process.versions.node}, Chromium ${process.versions.chrome}, and Electron ${process.versions.electron}. Powered by Mimi.`
	});
}

module.exports = {
	panelSubmit,
	about,
	options
}
