class Danmaku {
	constructor() {
		this.rows = 15;
		this.speedFactor = 500;
		this.frameRate = 50;

		this.output = [];
		this.last = new Array(this.rows);

		this.createCanvas();

		setInterval(() => {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.output = this.output.filter(item => {
				this.draw(item);
				item.x -= item.speed;
				return item.x >= -item.width;
			});
		}, 1000 / this.frameRate);
	}

	createCanvas() {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		document.body.appendChild(canvas);

		this.canvas = canvas;
		this.context = context;
		window.addEventListener("resize", () => this.resize());
		this.resize();
	}

    setBackground() {
        const availableBg = ["sky.jpg", "bg1.jpg", "bg2.jpg"];
        const bg = availableBg[Math.floor(Math.random() * availableBg.length)];
        this.canvas.style.backgroundImage = `url(images/${bg})`;
    }

	resize() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight;
		this.baseSize = this.canvas.height / this.rows;
	}

	randColor() {
		const colors = ["orange", "red", "blue", "purple", "green", "white"];
		return colors[Math.floor(Math.random() * colors.length)];
	}

	insertDanmaku(danmaku) {
		danmaku.x = this.canvas.width;
		for (let index = 0; index < this.rows; index++) {
			const target = this.last[index];
			let delta;
			if (target) delta = danmaku.x - target.x;
			if (!target || (danmaku.width < target.width && delta > target.width) || (danmaku.width > target.width && delta > danmaku.width * (danmaku.x + target.width) / (danmaku.x + target.width))) {
				danmaku.y = this.baseSize * (index + 1);
				this.last[index] = danmaku;
				this.output.push(danmaku);
				return;
			}
		}
		// Danmaku is dropped if there's no space for it
	}

	createDanmaku(message) {
		let { content, meta: { size, color } } = message;
		const reg = /^#([\da-fA-F]{6}|[\da-fA-F]{3})$/;
		if (!reg.test(color)) color = this.randColor();
		if (typeof size !== "number") size = parseFloat(size);
		if (isNaN(size) || size > 1 || size < 0) size = 1;
		if (content.startsWith("$") && content.endsWith("$")) {
			this.renderMath(content, size, color);
			return;
		}
		const fontSize = this.baseSize * size;
		// Set font to measureText
		this.context.font = `700 ${fontSize}px Microsoft YaHei`;
		const { width } = this.context.measureText(content);
		const danmaku = {
			speed: (this.canvas.width + width) / this.speedFactor,
			content,
			size: fontSize,
			width,
			color
		};
		this.insertDanmaku(danmaku);
	}

	async renderMath(content, size, color) {
		content = content.match(/^\$(.*?)\$$/)[1];
		const svgOut = await MathJax.tex2svgPromise(content, {
			display: false
		});
		const svg = svgOut.querySelector("svg");
		const img = new Image();
		let xml = new XMLSerializer().serializeToString(svg);
		xml = xml.replace(/currentColor/g, color);
		img.src = "data:image/svg+xml;base64," + btoa(xml);
		img.onload = () => {
			const danmaku = {
				speed  : (this.canvas.width + img.width) / this.speedFactor,
				content: img,
				width  : img.width,
				height : img.height
			};
			this.insertDanmaku(danmaku);
		};
	}

	draw(obj) {
		if (typeof obj.content === "string") {
			this.context.font = `700 ${obj.size}px Microsoft YaHei`;
			this.context.fillStyle = obj.color;
			this.context.fillText(obj.content, obj.x, obj.y);
		} else {
			this.context.drawImage(obj.content, obj.x, obj.y, obj.width, obj.height);
		}
	}
}
