"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SceneEvent extends EventTarget {
    addEventListener(type, callback) {
        super.addEventListener(type, callback);
    }
    dispatchEvent(event) {
        super.dispatchEvent(event);
        return true;
    }
}
exports.default = SceneEvent;
