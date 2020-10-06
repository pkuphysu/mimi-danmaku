const mainWindow = require("./mainwindow");
const { options } = require("./settings");
const { config } = require("./utils");

class DanmakuController {
	constructor() {
		this.outputArray = [];
	}

	allow(index, flag) {
		const target = document.getElementById(index).querySelectorAll("button");
		if (target[0].classList.contains("disabled")) return;
		if (mainWindow.window) {
			mainWindow.send("danmaku", JSON.stringify(this.outputArray[index]));
			target[0].innerHTML = "已通过";
			target[0].classList.add("disabled");
			target[1].innerHTML = "禁止";
			target[1].classList.remove("disabled");
		}
		else if (flag) ipcRenderer.send("show-message", "请先开启弹幕窗口！");
	}

	deny(index) {
		const target = document.getElementById(index).querySelectorAll("button");
		if (target[1].classList.contains("disabled")) return;
		target[0].innerHTML = "通过";
		target[0].classList.remove("disabled");
		target[1].innerHTML = "已禁止";
		target[1].classList.add("disabled");
		if (mainWindow.window) {
			mainWindow.send("remove", JSON.stringify(this.outputArray[index]));
		}
	}

	insert(msg) {
		const message = {
			content: msg.content,
			size: msg.meta.size,
			color: msg.meta.color
		};
		const index = this.outputArray.length;
		const element = document.createElement("tr");
		element.id = index;
		element.innerHTML = `<td>${msg.content}</td>
			<td>
				<div class="btn-group" role="group">
					<button type="button" class="btn btn-success">通过</button>
					<button type="button" class="btn btn-danger">禁止</button>
				</div>
			</td>`;
		document.querySelector("tbody").prepend(element);
		// Bind this
		element.querySelector(".btn-success").addEventListener("click", () => this.allow(index, true));
		element.querySelector(".btn-danger").addEventListener("click", () => this.deny(index));
		this.outputArray.push(message);
		if (options[3] === 1) this.allow(index);
		else if (options[3] === 2) this.deny(index);
		else this.filter(index); // 弹幕过滤器
	}

	filter(index) {
		const ruleArray = config.rule.split(" ");
		const tmp = this.outputArray[index];
		let flag = true;
		for (let rule of ruleArray) {
			if (rule === "") continue;
			if (tmp.content.includes(rule)) {
				if (options[4] === 0) {
					flag = false;
					break;
				} else {
					tmp.content = tmp.content.split(rule).join("*");
				}
			}
		}
		if (tmp.content.split("").every(char => char === "*")) flag = false;
		flag ? this.allow(index) : this.deny(index); //弹幕过滤器
	}

	clearAll() {
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

	denyAll() {
		for (let i in this.outputArray) this.deny(i);
	}
}

module.exports = new DanmakuController();
