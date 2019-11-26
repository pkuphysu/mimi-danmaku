var {
	server = "ws://localhost:9000",
	rule = "",
	channel = "default"
} = require("./config.json");

document.getElementById("rule").value = rule;
document.getElementById("channel").value = channel;

var mainWindow = null,
	currentChannel = "default",
	outputArray = [],
	allowArray = [],
	denyArray = [];

var options = [0, 0, 0, 0, 0];

function getChannel() {
	var reg = new RegExp(/[\x00-\xff]+/g);
	var channel = document.getElementById("channel").value || "default";
	if (!reg.test(channel)) channel = "default";
	return channel;
}

window.addEventListener("beforeunload", event => {
	if (mainWindow) {
		event.returnValue = false; // 弹幕窗口开启时无法退出控制面板
	}
});

[...document.querySelectorAll(".btn-group")].forEach((group, i) => {
	[...group.querySelectorAll("button")].forEach((target, j) => {
		target.setAttribute("i", i);
		target.setAttribute("j", j);
		target.addEventListener("mouseover", event => {
			document.getElementById("help").innerHTML = event.target.getAttribute("data-help");
		});
		target.addEventListener("mouseout", event => {
			document.getElementById("help").innerHTML = "欢迎使用米米弹幕";
		});
		target.addEventListener("click", event => {
			changeOption(event.target.getAttribute("i"), event.target.getAttribute("j"));
		});
	});
});

function changeOption(i, j) {
	i = parseInt(i);
	j = parseInt(j);
	var targets = document.querySelectorAll(".btn-group")[i].querySelectorAll("button");
	[...targets].forEach(target => target.classList.remove("active"));
	targets[j].classList.add("active");
	options[i] = j;
	if (i === 0) {
		document.querySelectorAll(".row")[!j + 2].style.display = "none";
		document.querySelectorAll(".row")[j + 2].style.display = "";
	}
}

function panelSubmit(event) {
	if (mainWindow) {
		document.getElementById("submit").innerHTML = "开启弹幕窗口";
		document.getElementById("submit").classList.remove("btn-danger");
		document.getElementById("submit").classList.add("btn-primary");
		closeWindow();
	} else {
		document.getElementById("submit").innerHTML = "关闭弹幕窗口";
		document.getElementById("submit").classList.remove("btn-primary");
		document.getElementById("submit").classList.add("btn-danger");
		createWindow();
	}
}

function about() {
	alert(`Mimi Danmaku Ver ${require("../package.json").version}\n\nWe are using Node.js ${process.versions.node}, Chromium ${process.versions.chrome}, and Electron ${process.versions.electron}. Powered by Mimi.`);
}
