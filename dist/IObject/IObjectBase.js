"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
class IObjectBase extends pixi_js_1.Container {
    constructor(name) {
        super();
        this.name = name;
    }
}
exports.default = IObjectBase;
