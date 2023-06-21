"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
class SceneBase extends EventTarget {
    constructor(name) {
        super();
        this.name = name;
        this.app = null;
        this.container = new pixi_js_1.Container();
        this.container.sortableChildren = true;
    }
    getApplication() {
        if (!this.app) {
            throw new Error(`[scene: ${this.name}] no application.`);
        }
        return this.app;
    }
    detach() {
        this.getApplication().stage.removeChild(this.container);
        this.app = null;
    }
    attachAt(app) {
        if (this.app) {
            this.detach();
        }
        this.app = app;
        this.app.stage.addChild(this.container);
    }
    addEventListener(type, callback) {
        super.addEventListener(type, callback);
    }
    dispatchEvent(event) {
        super.dispatchEvent(event);
        return true;
    }
    // eslint-disable-next-line class-methods-use-this
    wait(seconds) {
        return new Promise((resolve) => { window.setTimeout(() => resolve(), seconds * 1000); });
    }
}
exports.default = SceneBase;
