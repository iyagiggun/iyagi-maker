"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISprite = exports.IScene = exports.IObject = exports.ICharacter = exports.IBasicTracking = void 0;
const BasicTracking_1 = __importDefault(require("./AI/BasicTracking"));
exports.IBasicTracking = BasicTracking_1.default;
const ICharacter_1 = __importDefault(require("./IObject/ICharacter"));
exports.ICharacter = ICharacter_1.default;
const IObject_1 = __importDefault(require("./IObject/IObject"));
exports.IObject = IObject_1.default;
const Iyagi_1 = __importDefault(require("./Iyagi"));
const ISprite_1 = __importDefault(require("./Object/ISprite"));
exports.ISprite = ISprite_1.default;
const Scene_1 = __importDefault(require("./Scene"));
exports.IScene = Scene_1.default;
exports.default = Iyagi_1.default;
