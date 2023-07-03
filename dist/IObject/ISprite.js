"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISpriteMaker = exports.ISpritePrototype = void 0;
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
let spriteNamePrefix = 1;
exports.ISpritePrototype = {
    async load() {
        if (this._loaded) {
            return;
        }
        const framesMap = Object.keys(this._areaInfoMap).reduce((acc, dir) => {
            var _a;
            return ({
                ...acc,
                [dir]: coordsListToFrame(
                // eslint-disable-next-line no-plusplus
                `${spriteNamePrefix++}:${this._imgUrl}:${dir}`, (_a = this._areaInfoMap[dir]) === null || _a === void 0 ? void 0 : _a.coordsList),
            });
        }, {});
        await new pixi_js_1.Spritesheet(getTexture(this._imgUrl), {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            frames: Object.values(framesMap).reduce((acc, each) => ({ ...acc, ...each }), {}),
            meta: {
                scale: '1',
            },
        }).parse();
        this._spriteMap = Object.keys(framesMap).reduce((acc, dir) => ({
            ...acc,
            [dir]: getSprite(Object.keys(framesMap[dir]), this._loop),
        }), {});
        this._loaded = true;
    },
    getSprite(dir) {
        const sprite = this._spriteMap[dir];
        if (!sprite) {
            throw new Error('[ISprite.getSprite] No the sprite.');
        }
        return sprite;
    },
    getCollisionMod(dir) {
        return this._collisionModMap[dir];
    },
};
exports.ISpriteMaker = {
    from(imgUrl, areaInfoMap, loop = true) {
        const iSprite = Object.create(exports.ISpritePrototype);
        iSprite._imgUrl = imgUrl;
        iSprite._areaInfoMap = areaInfoMap;
        iSprite._loop = loop;
        iSprite._collisionModMap = Object.keys(areaInfoMap).reduce((acc, _dir) => {
            var _a, _b;
            const dir = _dir;
            const areaInfo = (_a = areaInfoMap[dir]) === null || _a === void 0 ? void 0 : _a.coordsList[0];
            if (!areaInfo) {
                return acc;
            }
            return {
                ...acc,
                [dir]: ((_b = areaInfoMap[dir]) === null || _b === void 0 ? void 0 : _b.collisionMod) || [0, 0, areaInfo[2], areaInfo[3]],
            };
        }, {});
        return iSprite;
    },
};
