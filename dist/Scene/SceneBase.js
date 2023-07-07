"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
class SceneBase extends EventTarget {
    constructor(app, name) {
        super();
        this.app = app;
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
    getContainer() {
        return this.container;
    }
    // eslint-disable-next-line class-methods-use-this
    wait(seconds) {
        return new Promise((resolve) => { window.setTimeout(() => resolve(), seconds * 1000); });
    }
}
exports.default = SceneBase;
