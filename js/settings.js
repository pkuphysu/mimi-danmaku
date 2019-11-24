const config = require("./config.json");
var server = config.server || "ws://localhost:9000",
	rule = config.rule || "",
	channel = config.channel || "default";

document.getElementById("rule").value = rule;
document.getElementById("channel").value = channel;

var mainWindow = null,
	currentChannel = "default",
	outputArray = [],
	allowArray = [],
	denyArray = [];

var helpArray = [
	["弹幕窗口将在全屏幕上浮动显示", "弹幕窗口将以窗口形式显示"],
	["窗口将始终处于屏幕顶层，即使存在其他全屏应用", "使用其他全屏应用时，弹幕窗口可能不会置顶"],
	["弹幕窗口背景透明", "弹幕窗口使用系统预设背景"],
	["弹幕按照规则自动过滤", "默认允许所有弹幕", "默认禁止所有弹幕"],
	["含有屏蔽词的弹幕直接禁止", "替换屏蔽词为*"]
];
var options = [0, 0, 0, 0, 0];

function getChannel() {
	var reg = new RegExp(/[\x00-\xff]+/g);
	var channel = document.getElementById("channel").value || "default";
	if (!reg.test(channel)) channel = "default";
	return channel;
}

window.addEventListener("beforeunload", event => {
	if (mainWindow) {
		event.returnValue = false;
		alert("弹幕窗口开启时无法退出控制面板");
	}
});

for (var i = 0; i < 5; i++) { //$(".btn-group").length
	[...document.querySelectorAll(".btn-group")[i].querySelectorAll("button")].forEach((target, j) => {
		target.setAttribute("i", i);
		target.setAttribute("j", j);
		target.addEventListener("mouseover", event => {
			document.getElementById("help").innerHTML = helpArray[event.target.getAttribute("i")][event.target.getAttribute("j")];
		});
		target.addEventListener("mouseout", event => {
			document.getElementById("help").innerHTML = "欢迎使用米米弹幕";
		});
		target.addEventListener("click", event => {
			changeOption(event.target.getAttribute("i"), event.target.getAttribute("j"));
		});
	});
}

function changeOption(i, j) {
	i = parseInt(i);
	j = parseInt(j);
	var targets = document.querySelectorAll(".btn-group")[i].querySelectorAll("button");
	[...targets].forEach(target => target.classList.remove("active"));
	targets[j].classList.add("active");
	options[i] = j;
	if (i == 0) {
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
	alert(`Mimi Danmaku Ver ${require("./package.json").version}\n\nWe are using Node.js ${process.versions.node}, Chromium ${process.versions.chrome}, and Electron ${process.versions.electron}. Powered by Mimi.`);
}
