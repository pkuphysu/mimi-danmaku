const electron = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
var mainWindow = null,
	currentChannel = "default",
	outputArray = new Array(),
	allowArray = new Array(),
	denyArray = new Array();

var helpArray = [
	["弹幕窗口将在全屏幕上浮动显示", "弹幕窗口将以窗口形式显示"],
	["使用其他全屏应用时弹幕窗口将始终处于屏幕顶层", "使用其他全屏应用时弹幕窗口将不会显示"],
	["弹幕窗口背景透明", "弹幕窗口使用系统预设背景"],
	["默认允许所有弹幕", "默认禁止所有弹幕", "弹幕按照规则自动过滤"]
];
var options = [0, 0, 0, 0];

function getChannel() {
	var reg = new RegExp(/[\x00-\xff]+/g);
	var channel =  $("#channel").val() || "default";
	if (!reg.test(channel)) channel = "default";
	return channel;
}
