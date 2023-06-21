"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObjectBase extends EventTarget {
    constructor(name) {
        super();
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
exports.default = ObjectBase;
