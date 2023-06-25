"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    constructor(props) {
        this.props = props;
        this.loaded = false;
    }
    async load() {
        var _a, _b, _c, _d;
        if (this.loaded) {
            return;
        }
        const upFrames = coordsListToFrame(`${this.props.name}:up`, (_a = this.props.up) === null || _a === void 0 ? void 0 : _a.coordsList);
        const downFrames = coordsListToFrame(`${this.props.name}:down`, (_b = this.props.down) === null || _b === void 0 ? void 0 : _b.coordsList);
        const leftFrames = coordsListToFrame(`${this.props.name}:left`, (_c = this.props.left) === null || _c === void 0 ? void 0 : _c.coordsList);
        const rightFrames = coordsListToFrame(`${this.props.name}:right`, (_d = this.props.right) === null || _d === void 0 ? void 0 : _d.coordsList);
        await new pixi_js_1.Spritesheet(getTexture(this.props.imgUrl), {
            frames: {
                ...upFrames, ...downFrames, ...leftFrames, ...rightFrames,
            },
            meta: {
                scale: '1',
            },
        }).parse();
        this.up = getSprite(Object.keys(upFrames), this.props.loop);
        this.down = getSprite(Object.keys(downFrames), this.props.loop);
        this.left = getSprite(Object.keys(leftFrames), this.props.loop);
        this.right = getSprite(Object.keys(rightFrames), this.props.loop);
        this.loaded = true;
    }
    getSprite(dir) {
        if (!this.loaded) {
            throw new Error(`[ISprite.getSprite] Not loaded. "${this.props.name}"`);
        }
        let sprite;
        switch (dir) {
            case 'up':
                sprite = this.up;
                break;
            case 'down':
                sprite = this.down;
                break;
            case 'left':
                sprite = this.left;
                break;
            case 'right':
                sprite = this.right;
                break;
            default:
                throw new Error(`[ISprite.getSprite] Invalid dir. ${dir}. "${this.props.name}"`);
        }
        if (!sprite) {
            throw new Error(`[ISprite.getSprite] No sprite. ${dir}. "${this.props.name}"`);
        }
        return sprite;
    }
    getCollisionMod(dir) {
        var _a, _b, _c;
        if (!this.loaded) {
            throw new Error(`[ISprite.getCollisionMod] Not loaded. "${this.props.name}"`);
        }
        let collisionMod;
        switch (dir) {
            case 'up':
                collisionMod = (_a = this.props.up) === null || _a === void 0 ? void 0 : _a.collisionMod;
                break;
            case 'down':
                collisionMod = this.props.down.collisionMod;
                break;
            case 'left':
                collisionMod = (_b = this.props.left) === null || _b === void 0 ? void 0 : _b.collisionMod;
                break;
            case 'right':
                collisionMod = (_c = this.props.right) === null || _c === void 0 ? void 0 : _c.collisionMod;
                break;
            default:
                throw new Error(`[ISprite.getCollisionMod] Invalid dir. ${dir}. "${this.props.name}"`);
        }
        if (!collisionMod) {
            const sprite = this.getSprite(dir);
            return [0, 0, sprite.width, sprite.height];
        }
        return collisionMod;
    }
}
exports.default = ISprite;
