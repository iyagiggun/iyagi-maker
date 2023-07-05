"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const _1 = __importStar(require("."));
const Constant_1 = require("../Constant");
const DEFAULT_PHOTO_INFO = { default: Constant_1.TRANSPARENT_1PX_IMG };
class ICharacter extends _1.default {
    constructor(name, iSpriteMap, photoMap) {
        super(name, iSpriteMap);
        this.photoMap = photoMap;
        this.doing = false;
        this.photoTextureMap = {};
        this.photo = new pixi_js_1.Sprite();
    }
    async load() {
        const photoMap = this.photoMap || DEFAULT_PHOTO_INFO;
        const photoKeys = Object.keys(photoMap);
        photoKeys.forEach((key) => pixi_js_1.Assets.add(`${this.name}:${key}`, photoMap[key]));
        this.photoTextureMap = await pixi_js_1.Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
        this.photo.texture = this.photoTextureMap[`${this.name}:default`];
        await super.load();
    }
    getPhoto() {
        return this.photo;
    }
    /**
     * not loop animation
     * @param actionSpriteKey
     * @returns
     */
    do(actionSpriteKey, speed = 1) {
        return new Promise((resolve, reject) => {
            if (this.doing) {
                resolve(false);
                return;
            }
            this.doing = true;
            const lastSpriteKey = Object.keys(this.iSpriteMap).find((key) => this.iSprite === this.iSpriteMap[key]);
            if (!lastSpriteKey) {
                reject(new Error('ICharacter.do] Fail to find last sprite key.'));
                return;
            }
            try {
                this.change(actionSpriteKey);
                const sprite = this.getSprite();
                if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
                    throw new Error(`[ICharacter.do] The action is not animated. "${this.name}". ${actionSpriteKey}`);
                }
                const onComplete = () => {
                    this.change(lastSpriteKey);
                    this.doing = false;
                    sprite.onComplete = undefined;
                    resolve(true);
                };
                sprite.loop = false;
                sprite.animationSpeed = speed * _1.DEFAULT_ANIMATION_SPEED;
                sprite.gotoAndPlay(0);
                sprite.onComplete = onComplete;
            }
            catch (e) {
                reject(e);
                this.change(lastSpriteKey);
            }
        });
    }
    isDoing() {
        return this.doing;
    }
}
exports.default = ICharacter;
