"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Coordinate_1 = require("../Utils/Coordinate");
const SceneBase_1 = __importDefault(require("./SceneBase"));
class SceneObjectManager extends SceneBase_1.default {
    constructor() {
        super(...arguments);
        this.objectList = [];
    }
    load() {
        return Promise.all(this.objectList.map((obj) => obj.load()));
    }
    draw() {
        this.objectList
            .forEach((obj) => {
            this.container.addChild(obj.getContainer());
        });
    }
    addObject(obj) {
        if (this.objectList.includes(obj)) {
            throw new Error(`Fail to add object. ${obj.getName()} is already in ${this.name}`);
        }
        this.objectList.push(obj);
        this.container.addChild(obj.getContainer());
        return this;
    }
    addObjectList(objList) {
        objList.forEach((obj) => this.addObject(obj));
        return this;
    }
    removeObject(obj) {
        if (!this.objectList.includes(obj)) {
            throw new Error(`Fail to add object. ${obj.getName()} is not in ${this.name}`);
        }
        this.objectList = this.objectList.filter((_obj) => _obj !== obj);
        this.container.removeChild(obj.getContainer());
    }
    getObjectNextX(target, dist) {
        const [curX, curY] = target.getPos();
        const width = target.getWidth();
        const height = target.getHeight();
        const nextX = curX + dist;
        const blockingObj = this.objectList.find((obj) => {
            if (obj === target || obj.getZIndex() !== target.getZIndex()) {
                return false;
            }
            return (0, Coordinate_1.isIntersecting)([nextX, curY, width, height], obj.getCollisionArea());
        });
        if (blockingObj) {
            const blockingObjX = blockingObj.getPos()[0];
            return curX < blockingObjX ? blockingObjX - width : blockingObjX + blockingObj.getWidth();
        }
        return nextX;
    }
    getObjectNextY(target, dist) {
        const [curX, curY] = target.getPos();
        const width = target.getWidth();
        const height = target.getHeight();
        const nextY = curY + dist;
        const blockingObj = this.objectList
            .find((obj) => {
            if (obj === target || obj.getZIndex() !== target.getZIndex()) {
                return false;
            }
            return (0, Coordinate_1.isIntersecting)([curX, nextY, width, height], obj.getCollisionArea());
        });
        if (blockingObj) {
            const blockingObjY = blockingObj.getPos()[1];
            return curY < blockingObjY ? blockingObjY - height : blockingObjY + blockingObj.getHeight();
        }
        return nextY;
    }
    getIntersectingObjectList(coords) {
        return this.objectList.filter((obj) => (0, Coordinate_1.isIntersecting)(coords, obj.getCollisionArea()));
    }
}
exports.default = SceneObjectManager;
