"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
const pixi_js_1 = require("pixi.js");
const TEXTURE_MAP = {};
const getTexture = (imgUrl) => {
    if (!TEXTURE_MAP[imgUrl]) {
        TEXTURE_MAP[imgUrl] = pixi_js_1.BaseTexture.from(imgUrl);
    }
    return TEXTURE_MAP[imgUrl];
};
const coordsListToFrame = (prefix, coordsList) => {
    if (!coordsList) {
        return {};
    }
    return coordsList.reduce((frames, [x, y, w, h], idx) => ({
        ...frames,
        [`${prefix}:${idx}`]: {
            frame: {
                x, y, w, h,
            },
        },
    }), {});
};
const getSprite = (frameKeyList, loop = true) => {
    if (frameKeyList.length === 1) {
        return pixi_js_1.Sprite.from(frameKeyList[0]);
    }
    if (frameKeyList.length > 1) {
        const aSprite = new pixi_js_1.AnimatedSprite(frameKeyList.map((key) => pixi_js_1.Texture.from(key)));
        aSprite.loop = loop;
        return aSprite;
    }
    return undefined;
};
const directionalPrototype = {
    getName() {
        return this._info.name;
    },
    async load() {
        var _a, _b, _c, _d;
        if (this._loaded) {
            return;
        }
        const upFrames = coordsListToFrame(`${this._info.name}:up`, (_a = this._info.up) === null || _a === void 0 ? void 0 : _a.coordsList);
        const downFrames = coordsListToFrame(`${this._info.name}:down`, (_b = this._info.down) === null || _b === void 0 ? void 0 : _b.coordsList);
        const leftFrames = coordsListToFrame(`${this._info.name}:left`, (_c = this._info.left) === null || _c === void 0 ? void 0 : _c.coordsList);
        const rightFrames = coordsListToFrame(`${this._info.name}:right`, (_d = this._info.right) === null || _d === void 0 ? void 0 : _d.coordsList);
        await new pixi_js_1.Spritesheet(getTexture(this._info.imgUrl), {
            frames: {
                ...upFrames, ...downFrames, ...leftFrames, ...rightFrames,
            },
            meta: {
                scale: '1',
            },
        }).parse();
        this._up = getSprite(Object.keys(upFrames), this._info.loop);
        this._down = getSprite(Object.keys(downFrames), this._info.loop);
        this._left = getSprite(Object.keys(leftFrames), this._info.loop);
        this._right = getSprite(Object.keys(rightFrames), this._info.loop);
        this._loaded = true;
    },
    getSprite(dir) {
        if (!this._loaded) {
            throw new Error(`[ISprite.getSprite] Not loaded. "${this._info.name}"`);
        }
        let sprite;
        switch (dir) {
            case 'up':
                sprite = this._up;
                break;
            case 'down':
                sprite = this._down;
                break;
            case 'left':
                sprite = this._left;
                break;
            case 'right':
                sprite = this._right;
                break;
            default:
                throw new Error(`[ISprite.getSprite] Invalid dir. ${dir}. "${this._info.name}"`);
        }
        if (!sprite) {
            throw new Error(`[ISprite.getSprite] No sprite. ${dir}. "${this._info.name}"`);
        }
        return sprite;
    },
    getCollisionMod(dir) {
        var _a, _b, _c;
        if (!this._loaded) {
            throw new Error(`[ISprite.getCollisionMod] Not loaded. "${this._info.name}"`);
        }
        let collisionMod;
        switch (dir) {
            case 'up':
                collisionMod = (_a = this._info.up) === null || _a === void 0 ? void 0 : _a.collisionMod;
                break;
            case 'down':
                collisionMod = this._info.down.collisionMod;
                break;
            case 'left':
                collisionMod = (_b = this._info.left) === null || _b === void 0 ? void 0 : _b.collisionMod;
                break;
            case 'right':
                collisionMod = (_c = this._info.right) === null || _c === void 0 ? void 0 : _c.collisionMod;
                break;
            default:
                throw new Error(`[ISprite.getCollisionMod] Invalid dir. ${dir}. "${this._info.name}"`);
        }
        if (!collisionMod) {
            const sprite = this.getSprite(dir);
            return [0, 0, sprite.width, sprite.height];
        }
        return collisionMod;
    },
};
exports.default = {
    from(info) {
        const instance = Object.create(directionalPrototype);
        Object.assign(instance, info);
        return instance;
    },
};
