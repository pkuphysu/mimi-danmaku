import mainWindow from "./mainwindow.js";

const options = [0, 0, 0, 0, 0];

document.querySelectorAll(":not(td) > .btn-group").forEach((group, i) => {
	group.querySelectorAll("button").forEach((target, j) => {
		target.addEventListener("mouseover", event => {
			document.getElementById("help").textContent = event.target.dataset.help;
		});
		target.addEventListener("mouseout", event => {
			document.getElementById("help").textContent = "欢迎使用米米弹幕";
		});
		target.addEventListener("click", event => {
			changeOption(i, j);
		});
	});
});

function changeOption(i, j) {
	const targets = document.querySelectorAll(".btn-group")[i].querySelectorAll("button");
	targets.forEach(target => target.classList.remove("active"));
	targets[j].classList.add("active");
	options[i] = j;
	if (i === 0) {
		document.querySelectorAll(".mb-3")[!j + 1].classList.add("d-none");
		document.querySelectorAll(".mb-3")[j + 1].classList.remove("d-none");
	}
}

function panelSubmit() {
	if (mainWindow.window) {
		document.getElementById("submit").textContent = "开启弹幕窗口";
		document.getElementById("submit").classList.replace("btn-danger", "btn-primary");
		mainWindow.closeWindow();
	} else {
		document.getElementById("submit").textContent = "关闭弹幕窗口";
		document.getElementById("submit").classList.replace("btn-primary", "btn-danger");
		mainWindow.createWindow(options);
	}
}

export {
	panelSubmit,
	options
};
