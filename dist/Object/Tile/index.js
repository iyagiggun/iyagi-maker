"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.I_TILE_SIZE = void 0;
const __1 = __importDefault(require(".."));
exports.I_TILE_SIZE = 32;
class ITile extends __1.default {
    constructor(name, info) {
        var _a;
        const [posX, posY] = info.pos || [];
        if (posX === undefined || posY === undefined) {
            throw new Error(`Fail to create ITile(${name}). Invalid pos. [${posX}, ${posY}]`);
        }
        const pos = [posX, posY, -Infinity]; // tile 의 높이는 무조건 최 하
        super(name, { ...info, pos, passable: (_a = info.passable) !== null && _a !== void 0 ? _a : true });
    }
}
exports.default = ITile;
