function allow(index, flag) {
	var tar0 = $("#" + index).find("button").eq(0),
		tar1 = $("#" + index).find("button").eq(1);
	if (tar0.hasClass("disabled")) return;
	if (mainWindow) {
		mainWindow.webContents.send("danmaku", JSON.stringify(outputArray[index]));
		tar0.html("已通过").addClass("disabled");
		tar1.html("禁止").removeClass("disabled");
	}
	else if (flag) alert("请先开启弹幕窗口！");
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

function filter(index) {
	var ruleArray = $("#rule").val().split(" ");
	var flag = true;
	for (var i in ruleArray) {
		if (ruleArray[i] == "") continue;
		if (outputArray[index].content.split("|")[0].indexOf(ruleArray[i]) != -1) {
			flag = false;
			break;
		}
	}
	if (flag) allow(index); //弹幕过滤器，屏蔽指定用户等
	else deny(index);
}
