"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const Constant_1 = require("../Constant");
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
const getDirection = (deltaX, deltaY) => {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
    }
    return deltaY > 0 ? 'down' : 'up';
};
class IObject {
    constructor(name, objInfo) {
        var _a;
        this.name = name;
        this.objInfo = objInfo;
        this.xDiff = 0;
        this.yDiff = 0;
        this.passable = (_a = objInfo.passable) !== null && _a !== void 0 ? _a : false;
    }
    getName() {
        return this.name;
    }
    attachAt(container) {
        container.addChild(this.getSprite());
    }
    setReact(reaction) {
        this.reaction = reaction;
    }
    react() {
        var _a;
        (_a = this.reaction) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    isPassable() {
        return this.passable;
    }
    getTexture() {
        const imageUrl = this.objInfo.imageUrl;
        if (!textureMap[imageUrl]) {
            textureMap[imageUrl] = pixi_js_1.BaseTexture.from(imageUrl);
        }
        return textureMap[imageUrl];
    }
    getDirFrames() {
        var _a, _b, _c;
        return {
            up: coordsListToFrame(`${this.name}-up`)((_a = this.objInfo.up) === null || _a === void 0 ? void 0 : _a.coordsList),
            down: coordsListToFrame(`${this.name}-down`)(this.objInfo.down.coordsList),
            left: coordsListToFrame(`${this.name}-left`)((_b = this.objInfo.left) === null || _b === void 0 ? void 0 : _b.coordsList),
            right: coordsListToFrame(`${this.name}-right`)((_c = this.objInfo.right) === null || _c === void 0 ? void 0 : _c.coordsList)
        };
    }
    async load() {
        var _a, _b, _c;
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
            throw new Error(`Fail to load ${this.name}. Down sprite info is required.`);
        }
        (_a = this.sprite.visible == this.objInfo.visible) !== null && _a !== void 0 ? _a : true;
        this.xDiff = (_b = this.objInfo.down.xDiff) !== null && _b !== void 0 ? _b : 0;
        this.yDiff = (_c = this.objInfo.down.yDiff) !== null && _c !== void 0 ? _c : 0;
        this.setPos(0, 0);
    }
    getSprite() {
        if (!this.sprite) {
            throw new Error(`asset '${this.name}' is not loaded`);
        }
        return this.sprite;
    }
    getWidth() {
        return this.getSprite().width + this.xDiff;
    }
    getHeight() {
        return this.getSprite().height + this.yDiff;
    }
    getPos() {
        const { x, y } = this.getSprite();
        return [x - this.xDiff, y - this.yDiff];
    }
    getGlobalPos() {
        const { x, y } = this.getSprite().getGlobalPosition();
        return [x - this.xDiff, y - this.yDiff];
    }
    setPos(x, y, zIndexGap = 0) {
        const sprite = this.getSprite();
        sprite.x = x + this.xDiff;
        sprite.y = y + this.yDiff;
        sprite.zIndex = y + zIndexGap;
    }
    getDirection() {
        switch (this.sprite) {
            case this.upS:
                return 'up';
            case this.downS:
                return 'down';
            case this.leftS:
                return 'left';
            case this.rightS:
                return 'right';
            default:
                throw new Error(`[IObjet: ${this.name}] Invalid direction. ${this.name} / ${!!this.sprite}`);
        }
    }
    changeDirection(deltaX, deltaY) {
        return this.setDirection(getDirection(deltaX, deltaY));
    }
    setDirection(direction) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const lastSprite = this.getSprite();
        const [lastX, lastY] = this.getPos();
        const parent = lastSprite.parent;
        switch (direction) {
            case 'up':
                this.sprite = this.upS;
                this.xDiff = (_b = (_a = this.objInfo.up) === null || _a === void 0 ? void 0 : _a.xDiff) !== null && _b !== void 0 ? _b : 0;
                this.yDiff = (_d = (_c = this.objInfo.up) === null || _c === void 0 ? void 0 : _c.yDiff) !== null && _d !== void 0 ? _d : 0;
                break;
            case 'down':
                this.sprite = this.downS;
                this.xDiff = (_e = this.objInfo.down.xDiff) !== null && _e !== void 0 ? _e : 0;
                this.yDiff = (_f = this.objInfo.down.yDiff) !== null && _f !== void 0 ? _f : 0;
                break;
            case 'left':
                this.sprite = this.leftS;
                this.xDiff = (_h = (_g = this.objInfo.left) === null || _g === void 0 ? void 0 : _g.xDiff) !== null && _h !== void 0 ? _h : 0;
                this.yDiff = (_k = (_j = this.objInfo.left) === null || _j === void 0 ? void 0 : _j.yDiff) !== null && _k !== void 0 ? _k : 0;
                break;
            case 'right':
                this.sprite = this.rightS;
                this.xDiff = (_m = (_l = this.objInfo.right) === null || _l === void 0 ? void 0 : _l.xDiff) !== null && _m !== void 0 ? _m : 0;
                this.yDiff = (_p = (_o = this.objInfo.right) === null || _o === void 0 ? void 0 : _o.yDiff) !== null && _p !== void 0 ? _p : 0;
                break;
            default:
                throw new Error(`Fail to change ${this.name} dir. Invalid direction. ${direction}`);
        }
        if (!this.sprite) {
            throw new Error(`Fail to change ${this.name} dir. no sprite. ${direction}`);
        }
        this.setPos(lastX, lastY);
        if (parent) {
            parent.removeChild(lastSprite);
            parent.addChild(this.sprite);
        }
        return this;
    }
    play(_speed) {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            return;
        }
        if (!sprite.playing) {
            sprite.play();
        }
        const speed = (_speed * 6) / Constant_1.FRAMES_PER_SECOND;
        if (sprite.animationSpeed === speed) {
            return;
        }
        sprite.animationSpeed = speed;
    }
    stop() {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            return;
        }
        sprite.stop();
    }
    wait(time = 0) {
        const sprite = this.getSprite();
        const playing = sprite instanceof pixi_js_1.AnimatedSprite ? sprite.playing : false;
        return new Promise((resolve) => {
            setTimeout(() => {
                if (playing && sprite instanceof pixi_js_1.AnimatedSprite) {
                    sprite.play();
                }
                resolve();
            }, time);
        });
    }
}
exports.default = IObject;
