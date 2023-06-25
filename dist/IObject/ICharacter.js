"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const _1 = __importDefault(require("."));
const Constant_1 = require("../Constant");
const DEFAULT_PHOTO_INFO = { default: Constant_1.TRANSPARENT_1PX_IMG };
class ICharacter extends _1.default {
    constructor(cProps) {
        super(cProps);
        this.cProps = cProps;
        this.loaded = false;
        this.name = cProps.name;
        this.status = cProps.status;
    }
    async load() {
        if (this.loaded) {
            return;
        }
        await super.load();
        const photoMap = this.cProps.photoMap || DEFAULT_PHOTO_INFO;
        const photoKeys = Object.keys(photoMap);
        photoKeys.forEach((key) => pixi_js_1.Assets.add(`${this.name}:${key}`, photoMap[key]));
        this.photoTextureMap = await pixi_js_1.Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
        this.photo = new pixi_js_1.Sprite();
        this.photo.texture = this.photoTextureMap[`${this.name}:default`];
        this.loaded = true;
    }
    getPhoto() {
        if (!this.photo) {
            throw new Error(`Fail to get photo. "${this.name}" is not loaded.`);
        }
        return this.photo;
    }
    isDoing() {
        console.error(this.name);
        return false;
    }
}
exports.default = ICharacter;
