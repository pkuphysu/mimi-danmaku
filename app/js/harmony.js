function allow(index, flag) {
	const target = document.getElementById(index).querySelectorAll("button");
	if (target[0].classList.contains("disabled")) return;
	if (mainWindow) {
		mainWindow.webContents.send("danmaku", JSON.stringify(outputArray[index]));
		target[0].innerHTML = "已通过";
		target[0].classList.add("disabled");
		target[1].innerHTML = "禁止";
		target[1].classList.remove("disabled");
	}
	else if (flag) message("请先开启弹幕窗口！");
}

function deny(index) {
	const target = document.getElementById(index).querySelectorAll("button");
	if (target[1].classList.contains("disabled")) return;
	target[0].innerHTML = "通过";
	target[0].classList.remove("disabled");
	target[1].innerHTML = "已禁止";
	target[1].classList.add("disabled");
	if (mainWindow) {
		mainWindow.webContents.send("remove", JSON.stringify(outputArray[index]));
	}
}

function filter(index) {
	const ruleArray = document.getElementById("rule").value.split(" ");
	let flag = true;
	for (let rule of ruleArray) {
		if (rule === "") continue;
		if (outputArray[index].content.includes(rule)) {
			if (options[4] === 0) {
				flag = false;
				break;
			} else {
				const tmp = outputArray[index];
				tmp.content = tmp.content.split(rule).join("*");
			}
		}
	}
	(flag && !outputArray[index].content.split("").every(char => char === "*")) ? allow(index) : deny(index); //弹幕过滤器
}

function clearAll() {
	document.querySelector("tbody").innerHTML = `<tr>
		<td>欢迎使用米米弹幕</td>
		<td>
			<div class="btn-group" role="group">
				<button type="button" class="btn btn-success disabled">已通过</button>
				<button type="button" class="btn btn-danger disabled">禁止</button>
			</div>
		</td>
	</tr>`;
}

function denyAll() {
	for (let i in outputArray) deny(i);
}
