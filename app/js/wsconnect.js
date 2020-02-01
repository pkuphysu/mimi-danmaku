var ws = null;
function wsinit(server, channel) {
	ws = new WebSocket(server, headers = "danmaku" + channel);

	ws.onopen = function() {
		message("系统消息：建立连接成功");
	}

	ws.onmessage = function(event) {
		var msg = JSON.parse(event.data);
		if (!msg.meta) return;
		if (msg.from !== "user") return;
		var message = {
			content: msg.content,
			size: msg.meta.size,
			color: msg.meta.color
		};
		var index = outputArray.length;
		document.querySelector("tbody").insertAdjacentHTML("afterbegin", `<tr id="${index}">
			<td>${msg.content}</td>
			<td>
				<div class="btn-group" role="group">
					<button type="button" class="btn btn-success" onclick="allow(${index}, true)">通过</button>
					<button type="button" class="btn btn-danger" onclick="deny(${index})">禁止</button>
				</div>
			</td>
		</tr>`);
		outputArray.push(message);
		if (options[3] === 1) allow(index);
		else if (options[3] === 2) deny(index);
		else filter(index); // 弹幕过滤器
	}

	ws.onerror = function() {
		message("系统消息：连接失败，请手动关闭窗口并稍后再试");
	}

	if (mainWindow) mainWindow.webContents.send("setchannel", channel);
}

function wsreload() {
	//if (getChannel() === currentChannel) return;
	currentChannel = getChannel();
	if (ws) ws.close();
	wsinit(server, currentChannel);
}

setInterval(() => {
	if (ws) ws.send("ping");
}, 30000);
