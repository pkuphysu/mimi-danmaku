const config = require("./config.json");

Object.keys(config).forEach(key => {
    let save = localStorage.getItem(key);
    if (save) config[key] = save;
    let element = document.getElementById(key);
    element.value = config[key];
    element.addEventListener("change", () => {
        let { value } = element;
        if (element.id === "channel") value = value.replace(/\W/g, "");
        if (value) localStorage.setItem(key, value);
        config[key] = value;
    });
});

function about() {
    ipcRenderer.send("show-message", `Mimi Danmaku Ver ${require("../package.json").version}\n\nWe are using Node.js ${process.versions.node}, Chromium ${process.versions.chrome}, and Electron ${process.versions.electron}. Powered by Mimi.`);
}

export {
    config,
    about
};
