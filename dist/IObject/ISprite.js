"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line max-classes-per-file
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
class ISprite {
    constructor(imgUrl, areaInfoMap, loop = true) {
        this.imgUrl = imgUrl;
        this.areaInfoMap = areaInfoMap;
        this.loop = loop;
        this.loaded = false;
        this.spriteMap = {};
    }
    async load() {
        if (this.loaded) {
            return;
        }
        const loadList = Object.keys(this.areaInfoMap).map(async (key) => {
            var _a;
            switch (key) {
                case 'up':
                case 'down':
                case 'left':
                case 'right':
                    {
                        const frames = coordsListToFrame(`${this.imgUrl}:${key}`, (_a = this.areaInfoMap[key]) === null || _a === void 0 ? void 0 : _a.coordsList);
                        await new pixi_js_1.Spritesheet(getTexture(this.imgUrl || ''), {
                            frames: {
                                ...frames,
                            },
                            meta: {
                                scale: '1',
                            },
                        }).parse();
                        this.spriteMap[key] = getSprite(Object.keys(frames), this.loop);
                    }
                    break;
                default:
                    throw new Error('[ISprite.load] Invalid key.');
            }
        });
        await Promise.all(loadList);
        this.loaded = true;
    }
    getSprite(dir) {
        if (!this.loaded) {
            throw new Error('[ISprite.getSprite] Not loaded.');
        }
        let sprite;
        switch (dir) {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                sprite = this.spriteMap[dir];
                break;
            default:
                throw new Error('[ISprite.getSprite] Invalid dir.');
        }
        if (!sprite) {
            throw new Error('[ISprite.getSprite] No sprite.');
        }
        return sprite;
    }
    getCollisionMod(dir) {
        var _a;
        if (!this.loaded) {
            throw new Error('[ISprite.getCollisionMod] Not loaded.');
        }
        let collisionMod;
        switch (dir) {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                collisionMod = (_a = this.areaInfoMap[dir]) === null || _a === void 0 ? void 0 : _a.collisionMod;
                break;
            default:
                throw new Error('[ISprite.getCollisionMod] Invalid dir.');
        }
        if (!collisionMod) {
            const sprite = this.getSprite(dir);
            return [0, 0, sprite.width, sprite.height];
        }
        return collisionMod;
    }
}
exports.default = ISprite;
