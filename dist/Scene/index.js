"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SceneController_1 = __importDefault(require("./SceneController"));
class Scene extends SceneController_1.default {
    constructor() {
        super(...arguments);
        this.status = 'idle';
    }
}
exports.default = Scene;
