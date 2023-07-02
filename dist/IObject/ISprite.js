"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line max-classes-per-file
const pixi_js_1 = require("pixi.js");
let spriteNamePrefix = 1;
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
        this.collisionModMap = Object.keys(areaInfoMap).reduce((acc, _dir) => {
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
    }
    async load() {
        if (this.loaded) {
            return;
        }
        const framesMap = Object.keys(this.areaInfoMap).reduce((acc, dir) => {
            var _a;
            return ({
                ...acc,
                [dir]: coordsListToFrame(
                // eslint-disable-next-line no-plusplus
                `${spriteNamePrefix++}:${this.imgUrl}:${dir}`, (_a = this.areaInfoMap[dir]) === null || _a === void 0 ? void 0 : _a.coordsList),
            });
        }, {});
        await new pixi_js_1.Spritesheet(getTexture(this.imgUrl), {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            frames: Object.values(framesMap).reduce((acc, each) => ({ ...acc, ...each }), {}),
            meta: {
                scale: '1',
            },
        }).parse();
        this.spriteMap = Object.keys(framesMap).reduce((acc, dir) => ({
            ...acc,
            [dir]: getSprite(Object.keys(framesMap[dir]), this.loop),
        }), {});
        this.loaded = true;
    }
    getSprite(dir) {
        const sprite = this.spriteMap[dir];
        if (!sprite) {
            throw new Error('[ISprite.getSprite] No the sprite.');
        }
        return sprite;
    }
    getCollisionMod(dir) {
        return this.collisionModMap[dir];
    }
}
exports.default = ISprite;
