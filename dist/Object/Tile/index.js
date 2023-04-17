"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TILE_SIZE = void 0;
const __1 = __importDefault(require(".."));
exports.TILE_SIZE = 32;
class ITile extends __1.default {
    constructor(name, objInfo) {
        var _a;
        objInfo.down.coordsList.forEach(([, , w, h]) => {
            if (w !== exports.TILE_SIZE || h !== exports.TILE_SIZE) {
                throw new Error(`ITile(${name}) size must be 32x32. not ${w}x${h}`);
            }
        });
        super(name, { ...objInfo, passable: (_a = objInfo.passable) !== null && _a !== void 0 ? _a : true });
    }
}
exports.default = ITile;
