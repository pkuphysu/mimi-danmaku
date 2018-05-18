function allow(index) {
	var tar0 = $("#" + index).find("button").eq(0),
		tar1 = $("#" + index).find("button").eq(1);
	if (tar0.hasClass("disabled")) return;
	if (mainWindow) {
		mainWindow.webContents.send("danmaku", JSON.stringify(outputArray[index]));
		tar0.html("已通过").addClass("disabled");
		tar1.html("禁止").removeClass("disabled");
	}
	else alert("请先开启弹幕窗口！");
}

function deny(index) {
	var tar0 = $("#" + index).find("button").eq(0),
		tar1 = $("#" + index).find("button").eq(1);
	if ($("#" + index).find("button").eq(1).hasClass("disabled")) return;
	tar0.html("通过").removeClass("disabled");
	tar1.html("已禁止").addClass("disabled");
	if (mainWindow) {
		mainWindow.webContents.send("remove", JSON.stringify(outputArray[index]));
	}
}
