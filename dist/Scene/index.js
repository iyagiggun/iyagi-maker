"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SceneController_1 = __importDefault(require("./SceneController"));
class IScene extends SceneController_1.default {
    constructor() {
        super(...arguments);
        this.status = 'idle';
    }
    drawMap() {
        // add object
        this.objectList.forEach((obj) => {
            this.container.addChild(obj);
        });
    }
    addChild(child) {
        this.container.addChild(child);
    }
}
exports.default = IScene;
