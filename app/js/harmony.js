import mainWindow from "./mainwindow.js";
import { options } from "./settings.js";
import { config } from "./utils.js";

class DanmakuController {
	constructor() {
		this.outputArray = [];
	}

	allow(index, flag) {
		const target = document.getElementById(index).querySelectorAll("button");
		if (target[0].classList.contains("disabled")) return;
		if (mainWindow.window) {
			mainWindow.send("danmaku", JSON.stringify(this.outputArray[index]));
			target[0].textContent = "已通过";
			target[0].classList.add("disabled");
			target[1].textContent = "禁止";
			target[1].classList.remove("disabled");
		}
		else if (flag) ipcRenderer.send("show-message", "请先开启弹幕窗口！");
	}

	deny(index) {
		const target = document.getElementById(index).querySelectorAll("button");
		if (target[1].classList.contains("disabled")) return;
		target[0].textContent = "通过";
		target[0].classList.remove("disabled");
		target[1].textContent = "已禁止";
		target[1].classList.add("disabled");
		if (mainWindow.window) {
			mainWindow.send("remove", JSON.stringify(this.outputArray[index]));
		}
	}

	insert(message) {
		const index = this.outputArray.length;
		const element = document.createElement("tr");
		element.id = index;
		element.innerHTML = `<td></td>
			<td>
				<div class="btn-group" role="group">
					<button type="button" class="btn btn-success">通过</button>
					<button type="button" class="btn btn-danger">禁止</button>
				</div>
			</td>`;
		element.querySelector("td").textContent = message.content;
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

export default new DanmakuController();
