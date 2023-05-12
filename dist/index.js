"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBasicBossAI = exports.ICharacter = exports.IScene = exports.IObject = void 0;
const BasicBossAI_1 = __importDefault(require("./AI/BasicBossAI"));
exports.IBasicBossAI = BasicBossAI_1.default;
const Iyagi_1 = __importDefault(require("./Iyagi"));
const Object_1 = __importDefault(require("./Object"));
exports.IObject = Object_1.default;
const Character_1 = __importDefault(require("./Object/Character"));
exports.ICharacter = Character_1.default;
const Scene_1 = __importDefault(require("./Scene"));
exports.IScene = Scene_1.default;
exports.default = Iyagi_1.default;
