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
    do(actionSpriteKey) {
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
