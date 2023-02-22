"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
class Iyagi {
    constructor(canvas) {
        this.width = parseInt(getComputedStyle(canvas).width);
        this.height = parseInt(getComputedStyle(canvas).height);
        this.app = new pixi_js_1.Application({
            view: canvas,
            backgroundColor: 0x000000,
            width: this.width,
            height: this.height
        });
    }
    play(scene) {
        this.app.stage.removeChildren();
        this.app.stage.addChild(scene);
        scene.drawMap();
    }
}
exports.default = Iyagi;
