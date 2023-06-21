"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IObjectBase_1 = __importDefault(require("./IObjectBase"));
class Collidable extends IObjectBase_1.default {
    constructor(name, area) {
        super(name);
        this.area = area;
    }
}
exports.default = Collidable;
