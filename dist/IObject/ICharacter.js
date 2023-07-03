"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICharacterMaker = exports.ICharacterPrototype = void 0;
const pixi_js_1 = require("pixi.js");
const _1 = require(".");
const Constant_1 = require("../Constant");
const DEFAULT_PHOTO_INFO = { default: Constant_1.TRANSPARENT_1PX_IMG };
exports.ICharacterPrototype = Object.assign(Object.create(_1.IObjectPrototype), {
    async load() {
        const photoMap = this._photoMap;
        const photoKeys = Object.keys(photoMap);
        photoKeys.forEach((key) => pixi_js_1.Assets.add(`${this.name}:${key}`, photoMap[key]));
        this._photoTextureMap = await pixi_js_1.Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
        this._photo.texture = this._photoTextureMap[`${this.name}:default`];
        await _1.IObjectPrototype.load.call(this);
    },
    getPhoto() {
        return this._photo;
    },
    do(actionISpriteKey) {
        if (this._doing) {
            return;
        }
        this._doing = true;
        const lastSpriteKey = Object.keys(this._iSpriteMap).find((key) => this._iSpriteMap[key] === this._iSprite);
        if (!lastSpriteKey) {
            throw new Error('[ICharacter.do] Fail to get last sprite key');
        }
        try {
            this.change(actionISpriteKey);
            const sprite = this.getSprite();
            if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
                throw new Error(`[ICharacter.do] The action is not animated. "${this.name}". ${actionISpriteKey}`);
            }
            const onComplete = () => {
                this.change(lastSpriteKey);
                this._doing = false;
                sprite.onComplete = undefined;
            };
            sprite.gotoAndPlay(0);
            sprite.onComplete = onComplete;
            this.play();
        }
        catch (e) {
            this.change(lastSpriteKey);
            throw e;
        }
    },
    isDoing() {
        return this._doing;
    },
});
exports.ICharacterMaker = {
    from(name, iSpriteMap, photoMap) {
        const iCharacter = _1.IObjectMaker.from(name, iSpriteMap);
        Object.setPrototypeOf(iCharacter, exports.ICharacterPrototype);
        iCharacter._photo = new pixi_js_1.Sprite();
        iCharacter._photoMap = photoMap || DEFAULT_PHOTO_INFO;
        iCharacter._doing = false;
        return iCharacter;
    },
};
