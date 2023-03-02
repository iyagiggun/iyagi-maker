"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TILE_SIZE = void 0;
const __1 = require("../..");
exports.TILE_SIZE = 32;
class ITile extends __1.IObject {
    constructor(name, objInfo) {
        var _a;
        objInfo.down.coordsList.forEach(([x, y, w, h]) => {
            if (w !== exports.TILE_SIZE || h !== exports.TILE_SIZE) {
                throw new Error(`ITile(${name}) size must be 32x32. not ${w}x${h}`);
            }
        });
        super(name, { ...objInfo, passable: (_a = objInfo.passable) !== null && _a !== void 0 ? _a : true });
    }
}
exports.default = ITile;
