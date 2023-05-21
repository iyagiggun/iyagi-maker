"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SceneEvent_1 = __importDefault(require("./SceneEvent"));
class ScenePixi extends SceneEvent_1.default {
    constructor(objectList) {
        super();
        this.objectList = objectList;
        this.blockingObjectList = objectList.filter((obj) => !obj.isPassable());
    }
    load() {
        return Promise.all(this.objectList.map((obj) => obj.load()));
    }
    addObject(obj) {
        if (!obj.isLoaded()) {
            throw new Error(`Fail to add object. ${obj.getName()} is not loaded.`);
        }
        if (this.objectList.includes(obj)) {
            throw new Error(`Fail to add object. ${obj.getName()} is already in ${this.name}`);
        }
        this.objectList.push(obj);
        if (!obj.isPassable()) {
            this.blockingObjectList.push(obj);
        }
        this.container.addChild(obj.getSprite());
    }
}
exports.default = ScenePixi;
