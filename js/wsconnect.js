var ws = null;
function wsinit(channel) {
	ws = new WebSocket("ws://localhost:9000", headers = "danmaku" + channel);

	ws.onopen = function() {
		alert("系统消息：建立连接成功");
	}

	ws.onmessage = function(event) {
		var msg = JSON.parse(event.data);
		if (msg.type != "user") return;
		var messageArray = msg.content.split("|");
		var index = outputArray.length;
		$("tbody").prepend('<tr id="' + index + '">\
					<td>' + messageArray[0] + '</td>\
					<td style="max-width: 90px;">\
						<div class="form-inline">\
							<button type="button" class="btn btn-success" onclick="allow(' + index + ')">通过</button>\
							<button type="button" class="btn btn-danger" onclick="deny(' + index + ')">禁止</button>\
						</div>\
					</td>\
				</tr>');
		outputArray.push(msg);
		if (options[3] == 0) allow(index);
		else if (options[3] == 1) deny(index);
		else {
			;
		}
	}

	ws.onerror = function() {
		alert("系统消息：连接失败，请手动关闭窗口并稍后再试");
	}

	if (mainWindow) mainWindow.webContents.send("setchannel", channel);
}

function wsreload() {
	//if (getChannel() == currentChannel) return;
	currentChannel = getChannel();
	if (ws) ws.close();
	wsinit(currentChannel);
}
