"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICharacterMaker = exports.IObjectMaker = exports.ISprite = exports.IScene = exports.IBasicTracking = void 0;
const BasicTracking_1 = __importDefault(require("./AI/BasicTracking"));
exports.IBasicTracking = BasicTracking_1.default;
const IObject_1 = require("./IObject");
Object.defineProperty(exports, "IObjectMaker", { enumerable: true, get: function () { return IObject_1.IObjectMaker; } });
const ICharacter_1 = require("./IObject/ICharacter");
Object.defineProperty(exports, "ICharacterMaker", { enumerable: true, get: function () { return ICharacter_1.ICharacterMaker; } });
const ISprite_1 = __importDefault(require("./IObject/ISprite"));
exports.ISprite = ISprite_1.default;
const Iyagi_1 = __importDefault(require("./Iyagi"));
const Scene_1 = __importDefault(require("./Scene"));
exports.IScene = Scene_1.default;
exports.default = Iyagi_1.default;
