"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirection = void 0;
const pixi_js_1 = require("pixi.js");
const Coordinate_1 = require("../Utils/Coordinate");
const Constant_1 = require("../Constant");
const DEFAULT_ANIMATION_SPEED = 6 / Constant_1.FRAMES_PER_SECOND; // 10 fps
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
const getDirection = (deltaX, deltaY) => {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
    }
    return deltaY > 0 ? 'down' : 'up';
};
exports.getDirection = getDirection;
class ISprite extends EventTarget {
    constructor(name, info) {
        super();
        this.name = name;
        this.info = info;
        this.loaded = false;
        this.container = null;
        this.directionalSpriteMap = {
            up: undefined,
            down: undefined,
            left: undefined,
            right: undefined,
        };
    }
    async load() {
        var _a, _b, _c, _d, _e, _f, _g;
        console.error('call!!!');
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
        console.error('loaded');
        this.directionalSpriteMap.up = getSprite(Object.keys(frames.up), (_d = this.info.up) === null || _d === void 0 ? void 0 : _d.loop);
        this.directionalSpriteMap.down = getSprite(Object.keys(frames.down), (_e = this.info.down) === null || _e === void 0 ? void 0 : _e.loop);
        this.directionalSpriteMap.left = getSprite(Object.keys(frames.left), (_f = this.info.left) === null || _f === void 0 ? void 0 : _f.loop);
        this.directionalSpriteMap.right = getSprite(Object.keys(frames.right), (_g = this.info.right) === null || _g === void 0 ? void 0 : _g.loop);
        this.setDirection(this.info.dir || 'down');
    }
    getSprite() {
        if (!this.sprite) {
            throw new Error(`Fail to get "${this.name}" sprite. no data.`);
        }
        return this.sprite;
    }
    addEventListener(type, callback, options) {
        super.addEventListener(type, callback, options);
    }
    show() {
        this.getSprite().visible = true;
        return this;
    }
    hide() {
        this.getSprite().visible = false;
        return this;
    }
    getCollisionMod() {
        if (!this.collisionMod) {
            const sprite = this.getSprite();
            return [0, 0, sprite.width, sprite.height];
        }
        return this.collisionMod;
    }
    getCollisionCoords() {
        const [x, y] = this.getPos();
        const [, , colsW, colsH] = this.getCollisionMod();
        return [x, y, colsW, colsH];
    }
    getWidth() {
        return this.getCollisionMod()[Coordinate_1.COORDS_W_IDX];
    }
    getHeight() {
        return this.getCollisionMod()[Coordinate_1.COORDS_H_IDX];
    }
    getPos() {
        const [modX, modY] = this.getCollisionMod();
        const { x: spriteX, y: spriteY } = this.getSprite();
        return [spriteX + modX, spriteY + modY];
    }
    setPos(x, y, zMod = 0) {
        const sprite = this.getSprite();
        const [modX, modY] = this.getCollisionMod();
        sprite.x = x - modX;
        sprite.y = y - modY;
        sprite.zIndex = sprite.y + sprite.height + zMod;
        return this;
    }
    getGlobalPos() {
        const [modX, modY] = this.getCollisionCoords();
        const { x: globalX, y: globalY } = this.getSprite().getGlobalPosition();
        return [globalX + modX, globalY + modY];
    }
    attachAt(container) {
        if (this.container) {
            this.detach();
        }
        this.container = container;
        this.container.addChild(this.getSprite());
    }
    detach() {
        if (!this.container) {
            throw new Error(`Fail to detach "${this.name}" no the container.`);
        }
        this.container.removeChild(this.getSprite());
        this.container = null;
    }
    getDirection() {
        const sprite = this.getSprite();
        const dirs = Object.keys(this.directionalSpriteMap);
        const found = dirs.find((dir) => this.directionalSpriteMap[dir] === sprite);
        if (!found) {
            throw new Error(`Fail to get "${this.name}" direction.`);
        }
        return found;
    }
    setDirection(direction) {
        var _a;
        const next = this.directionalSpriteMap[direction];
        if (!next) {
            throw new Error(`Fail to change "${this.name}" direction(${direction}). no data.`);
        }
        const lastSprite = this.sprite;
        const [lastX, lastY] = lastSprite ? this.getPos() : [0, 0];
        this.sprite = next;
        this.collisionMod = (_a = this.info[direction]) === null || _a === void 0 ? void 0 : _a.collisionCoords;
        if (!lastSprite) {
            return this;
        }
        if (lastSprite instanceof pixi_js_1.AnimatedSprite) {
            lastSprite.stop();
        }
        if (!this.container) {
            return this;
        }
        this.container.removeChild(lastSprite);
        this.setPos(lastX, lastY);
        this.container.addChild(this.sprite);
        return this;
    }
    play(acc = 1, playPosition) {
        var _a;
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            return;
        }
        if (sprite.playing) {
            return;
        }
        const dir = this.getDirection();
        const base = ((_a = this.info[dir]) === null || _a === void 0 ? void 0 : _a.animationSpeed) || DEFAULT_ANIMATION_SPEED;
        sprite.animationSpeed = acc * base;
        if (!sprite.playing) {
            sprite.onFrameChange = () => {
                this.dispatchEvent(new CustomEvent('onFrameChange'));
            };
            sprite.onComplete = () => {
                this.dispatchEvent(new CustomEvent('onComplete'));
            };
            sprite.onLoop = () => {
                this.dispatchEvent(new CustomEvent('onLoop'));
            };
            if (playPosition === undefined) {
                sprite.play();
            }
            else {
                sprite.gotoAndPlay(playPosition);
            }
        }
    }
    stop() {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            return;
        }
        sprite.stop();
    }
    isPlaying() {
        if (!(this.sprite instanceof pixi_js_1.AnimatedSprite)) {
            return false;
        }
        return this.sprite.playing;
    }
    replace(next) {
        const { container } = this;
        if (!container) {
            throw new Error(`Fail to replace "${this.name}". no the container.`);
        }
        const [x, y] = this.getPos();
        next.setDirection(this.getDirection());
        next.setPos(x, y);
        this.stop();
        this.detach();
        next.attachAt(container);
    }
    getCurrentFrame() {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            throw new Error(`Fail to get current fame. "${this.name}" is not AnimatiedSprite.`);
        }
        return sprite.currentFrame;
    }
    isLoopAnimation() {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            return false;
        }
        return sprite.loop;
    }
    isAnimation() {
        return this.getSprite() instanceof pixi_js_1.AnimatedSprite;
    }
}
exports.default = ISprite;
