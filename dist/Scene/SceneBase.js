"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
class SceneBase extends EventTarget {
    constructor(name) {
        super();
        this.name = name;
        this.container = new pixi_js_1.Container();
        this.container.sortableChildren = true;
    }
    addEventListener(type, callback) {
        super.addEventListener(type, callback);
    }
    dispatchEvent(event) {
        super.dispatchEvent(event);
        return true;
    }
}
exports.default = SceneBase;
