"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
class Iyagi {
    constructor(canvas) {
        this.width = parseInt(getComputedStyle(canvas).width, 10);
        this.height = parseInt(getComputedStyle(canvas).height, 10);
        this.app = new pixi_js_1.Application({
            view: canvas,
            backgroundColor: 0x000000,
            width: this.width,
            height: this.height,
        });
    }
    async play(scene) {
        await scene.load();
        if (this.currentScene) {
            this.currentScene.detach();
        }
        scene.attachAt(this.app);
        scene.drawMap();
        scene.dispatchEvent(new CustomEvent('start'));
    }
}
exports.default = Iyagi;
