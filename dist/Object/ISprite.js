"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const Coordinate_1 = require("../Utils/Coordinate");
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
        this.directionalSpriteMap.right = getSprite(Object.keys(frames.right), (_k = this.info.right) === null || _k === void 0 ? void 0 : _k.animationSpeed, (_l = this.info.right) === null || _l === void 0 ? void 0 : _l.loop);
        this.setDirection(this.info.dir || 'down');
    }
    getSprite() {
        if (!this.sprite) {
            throw new Error(`Fail to get "${this.name}" sprite. no data.`);
        }
        return this.sprite;
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
    attach(container) {
        container.addChild(this.getSprite());
    }
    detach(container) {
        container.removeChild(this.getSprite());
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
        const last = this.sprite;
        const [lastX, lastY] = last ? this.getPos() : [0, 0];
        this.sprite = next;
        this.collisionMod = (_a = this.info[direction]) === null || _a === void 0 ? void 0 : _a.collisionCoords;
        if (!last) {
            return this;
        }
        if (last instanceof pixi_js_1.AnimatedSprite) {
            last.stop();
        }
        this.setPos(lastX, lastY);
        const { parent } = last;
        if (parent) {
            parent.removeChild(last);
            parent.addChild(this.sprite);
        }
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
}
exports.default = ISprite;
