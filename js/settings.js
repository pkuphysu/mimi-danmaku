const electron = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;
const BrowserWindow = electron.BrowserWindow;
const fs = require("fs");
var server = "ws://localhost:9000",
	rule = "",
	channel = "default";

fs.readFile("config.json", function(err, data) {
	if (err) throw err;
	var result = JSON.parse(data.toString());
	server = result.server || server;
	rule = result.rule || rule;
	channel = result.channel || channel;
	$("#rule").val(rule);
	$("#channel").val(channel);
});

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
	var channel =  $("#channel").val() || "default";
	if (!reg.test(channel)) channel = "default";
	return channel;
}

window.addEventListener("beforeunload", e => {
	if (mainWindow) {
		e.returnValue = false;
		alert("弹幕窗口开启时无法退出控制面板");
	}
});

for (var i = 0; i < 5; i++) { //$(".btn-group").length
	for (var j = 0; j < $(".btn-group").eq(i).find("button").length; j++) {
		var target = $(".btn-group").eq(i).find("button").eq(j);
		target.attr("i", i);
		target.attr("j", j);
		target.mouseover(event => {
			$("#help").html(helpArray[$(event.target).attr("i")][$(event.target).attr("j")]);
		});
		target.mouseout(event => {
			$("#help").html("欢迎使用米米弹幕");
		});
		target.click(event => {
			changeOption($(event.target).attr("i"), $(event.target).attr("j"));
		});
	}
}

function changeOption(i, j) {
	i = parseInt(i);
	j = parseInt(j);
	var target = $(".btn-group").eq(i).find("button");
	target.removeClass("active");
	target.eq(j).addClass("active");
	options[i] = j;
	if (i == 0) {
		$(".row").eq(!j + 2).hide();
		$(".row").eq(j + 2).show();
	}
}

function panelSubmit(event) {
	if (mainWindow) {
		$("#submit").html("开启弹幕窗口");
		$("#submit").removeClass("btn-danger");
		$("#submit").addClass("btn-primary");
		closeWindow();
	} else {
		$("#submit").html("关闭弹幕窗口");
		$("#submit").removeClass("btn-primary");
		$("#submit").addClass("btn-danger");
		createWindow();
	}
}

function about() {
	alert(`Mimi Danmaku Ver 1.0.3\n\nWe are using Node.js ${process.versions.node}, Chromium ${process.versions.chrome}, and Electron ${process.versions.electron}. Powered by Mimi.`);
}

document.addEventListener("dragover", event => {
	event.preventDefault();
	return false;
}, false);

document.addEventListener("drop", event => {
	event.preventDefault();
	return false;
}, false);
