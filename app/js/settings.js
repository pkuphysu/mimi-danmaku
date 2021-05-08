const mainWindow = require("./mainwindow");

const options = [0, 0, 0, 0, 0];

window.addEventListener("beforeunload", event => {
	if (mainWindow.window) {
		ipcRenderer.send("show-warning", "弹幕窗口处于开启状态，无法退出控制面板！");
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
		document.querySelectorAll(".mb-3")[!j + 1].style.display = "none";
		document.querySelectorAll(".mb-3")[j + 1].style.display = "";
	}
}

function panelSubmit() {
	if (mainWindow.window) {
		document.getElementById("submit").innerHTML = "开启弹幕窗口";
		document.getElementById("submit").classList.replace("btn-danger", "btn-primary");
		mainWindow.closeWindow();
	} else {
		document.getElementById("submit").innerHTML = "关闭弹幕窗口";
		document.getElementById("submit").classList.replace("btn-primary", "btn-danger");
		mainWindow.createWindow(options);
	}
}

module.exports = {
	panelSubmit,
	options
};
