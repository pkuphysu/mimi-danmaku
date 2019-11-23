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
	for (let rule of ruleArray) {
		if (rule == "") continue;
		if (outputArray[index].content.split("|")[0].indexOf(rule) != -1) {
			if (options[4] == 0) {
				flag = false;
				break;
			} else {
				var tmp = outputArray[index].content.split("|");
				tmp[0] = tmp[0].split(rule).join("*");
				outputArray[index].content = tmp.join("|");
			}
		}
	}
	(flag && !outputArray[index].content.split("|")[0].split("").every(char => char == "*")) ? allow(index) : deny(index); //弹幕过滤器
}

function clearAll() {
	$("tbody").html(`<tr>
					<td>欢迎使用米米弹幕</td>
					<td>
						<div class="btn-group" role="group">
							<button type="button" class="btn btn-success disabled">已通过</button>
							<button type="button" class="btn btn-danger disabled">禁止</button>
						</div>
					</td>
				</tr>`);
}

function denyAll() {
	for (let i in outputArray) deny(i);
}
