"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const Event_1 = __importDefault(require("../Scene/Event"));
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
        scene.load().then(() => {
            scene.setApplication(this.app);
            scene.drawMap();
            scene.dispatchEvent(new Event_1.default('start'));
        });
    }
}
exports.default = Iyagi;
