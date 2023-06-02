"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const Constant_1 = require("../Constant");
const TEXTURE_MAP = {};
const getTexture = (spriteUrl) => {
    if (!TEXTURE_MAP[spriteUrl]) {
        TEXTURE_MAP[spriteUrl] = pixi_js_1.BaseTexture.from(spriteUrl);
    }
    return TEXTURE_MAP[spriteUrl];
};
const coordsListToFrame = (prefix) => (coordsList) => {
    if (!coordsList) {
        return {};
    }
    return coordsList.reduce((frames, [x, y, w, h], idx) => ({
        ...frames,
        [`${prefix}-${idx}`]: {
            frame: {
                x, y, w, h,
            },
        },
    }), {});
};
const getSprite = (frameKeyList, animationSpeed = 1, loop = true) => {
    if (frameKeyList.length === 1) {
        return pixi_js_1.Sprite.from(frameKeyList[0]);
    }
    if (frameKeyList.length > 1) {
        const aSprite = new pixi_js_1.AnimatedSprite(frameKeyList.map((key) => pixi_js_1.Texture.from(key)));
        aSprite.loop = loop;
        aSprite.animationSpeed = animationSpeed;
        return aSprite;
    }
    return undefined;
};
class ISprite {
    constructor(name, info) {
        this.name = name;
        this.info = info;
        this.loaded = false;
        this.directionalSpriteMap = {
            up: undefined,
            down: undefined,
            left: undefined,
            right: undefined,
        };
    }
    async load() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (this.loaded) {
            return;
        }
        const frames = {
            up: coordsListToFrame(`${this.name}-up`)((_a = this.info.up) === null || _a === void 0 ? void 0 : _a.coordsList),
            down: coordsListToFrame(`${this.name}-down`)(this.info.down.coordsList),
            left: coordsListToFrame(`${this.name}-left`)((_b = this.info.left) === null || _b === void 0 ? void 0 : _b.coordsList),
            right: coordsListToFrame(`${this.name}-right`)((_c = this.info.right) === null || _c === void 0 ? void 0 : _c.coordsList),
        };
        await new pixi_js_1.Spritesheet(getTexture(this.info.spriteUrl), {
            frames: Object.values(frames).reduce((acc, _frames) => {
                if (!_frames) {
                    return acc;
                }
                return {
                    ...acc,
                    ..._frames,
                };
            }, {}),
            meta: {
                scale: '1',
            },
        }).parse();
        this.directionalSpriteMap.up = getSprite(Object.keys(frames.up), (_d = this.info.up) === null || _d === void 0 ? void 0 : _d.animationSpeed, (_e = this.info.up) === null || _e === void 0 ? void 0 : _e.loop);
        this.directionalSpriteMap.down = getSprite(Object.keys(frames.down), (_f = this.info.down) === null || _f === void 0 ? void 0 : _f.animationSpeed, (_g = this.info.down) === null || _g === void 0 ? void 0 : _g.loop);
        this.directionalSpriteMap.left = getSprite(Object.keys(frames.left), (_h = this.info.left) === null || _h === void 0 ? void 0 : _h.animationSpeed, (_j = this.info.left) === null || _j === void 0 ? void 0 : _j.loop);
        this.directionalSpriteMap.down = getSprite(Object.keys(frames.down), (_k = this.info.down) === null || _k === void 0 ? void 0 : _k.animationSpeed, (_l = this.info.down) === null || _l === void 0 ? void 0 : _l.loop);
        this.setDirection(this.info.dir || 'down');
    }
    getSprite() {
        if (!this.sprite) {
            throw new Error(`Fail to get "${this.name}" sprite. no data.`);
        }
        return this.sprite;
    }
    setDirection(direction) {
        const next = this.directionalSpriteMap[direction];
        if (!next) {
            throw new Error(`Fail to change "${this.name}" direction(${direction}). no data.`);
        }
        this.sprite = next;
        return this;
    }
    play(speed) {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            return;
        }
        if (!sprite.playing) {
            sprite.play();
        }
        sprite.animationSpeed = (speed * 6) / Constant_1.FRAMES_PER_SECOND;
    }
    isPlaying() {
        if (!(this.sprite instanceof pixi_js_1.AnimatedSprite)) {
            return false;
        }
        return this.sprite.playing;
    }
    stop() {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            return;
        }
        sprite.stop();
    }
}
exports.default = ISprite;
