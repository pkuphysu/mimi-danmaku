function getChannel() {
    let channel = document.getElementById("channel").value.replace(/\W/g, "") || "default";
    return channel;
}

module.exports = {
    getChannel
}
