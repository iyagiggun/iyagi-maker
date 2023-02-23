"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const textureMap = {};
const coordsListToFrame = (prefix) => (coordsList) => {
    if (!coordsList) {
        return {};
    }
    return coordsList.reduce((frames, [x, y, w, h], idx) => {
        return {
            ...frames,
            [`${prefix}-${idx}`]: {
                frame: { x, y, w, h }
            }
        };
    }, {});
};
const getSprite = (frameKeyList) => {
    if (frameKeyList.length === 1) {
        return pixi_js_1.Sprite.from(frameKeyList[0]);
    }
    if (frameKeyList.length > 1) {
        return new pixi_js_1.AnimatedSprite(frameKeyList.map((key) => pixi_js_1.Texture.from(key)));
    }
    return undefined;
};
class IObject {
    constructor(name, spriteInfo) {
        this.name = name;
        this.spriteInfo = spriteInfo;
    }
    getTexture() {
        const imageUrl = this.spriteInfo.imageUrl;
        if (!textureMap[imageUrl]) {
            textureMap[imageUrl] = pixi_js_1.BaseTexture.from(imageUrl);
        }
        return textureMap[imageUrl];
    }
    getDirFrames() {
        return {
            up: coordsListToFrame(`${this.name}-up`)(this.spriteInfo.up),
            down: coordsListToFrame(`${this.name}-down`)(this.spriteInfo.down),
            left: coordsListToFrame(`${this.name}-left`)(this.spriteInfo.left),
            right: coordsListToFrame(`${this.name}-right`)(this.spriteInfo.right)
        };
    }
    async load() {
        var _a;
        // case: loaded
        if (this.sprite) {
            return Promise.resolve();
        }
        // case: still not loaded
        const dirFrames = this.getDirFrames();
        await new pixi_js_1.Spritesheet(this.getTexture(), {
            frames: Object.values(dirFrames).reduce((acc, _frames) => {
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
            }
        }).parse();
        this.upS = getSprite(Object.keys(dirFrames.up));
        this.downS = getSprite(Object.keys(dirFrames.down));
        this.leftS = getSprite(Object.keys(dirFrames.left));
        this.rightS = getSprite(Object.keys(dirFrames.right));
        this.sprite = this.downS;
        if (this.sprite === undefined) {
            throw new Error(`Fail to load ${this.name}. No down sprite data.`);
        }
        (_a = this.sprite.visible == this.spriteInfo.visible) !== null && _a !== void 0 ? _a : true;
    }
    getSprite() {
        if (!this.sprite) {
            throw new Error(`asset '${this.name}' is not loaded`);
        }
        return this.sprite;
    }
    changeDirection(direction) {
        const lastS = this.sprite;
        const parent = lastS === null || lastS === void 0 ? void 0 : lastS.parent;
        let nextS = undefined;
        switch (direction) {
            case 'up':
                nextS = this.upS;
                break;
            case 'down':
                nextS = this.downS;
                break;
            case 'left':
                nextS = this.leftS;
                break;
            case 'right':
                nextS = this.rightS;
                break;
            default:
                throw new Error(`Fail to change ${this.name} dir. Invalid value. ${direction}`);
        }
        if (!nextS) {
            throw new Error(`Fail to change ${this.name} dir. no sprite. ${direction}`);
        }
        this.sprite = nextS;
        if (parent) {
            parent.removeChild(lastS);
            parent.addChild(this.sprite);
        }
    }
}
exports.default = IObject;
