"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ANIMATION_SPEED = void 0;
const pixi_js_1 = require("pixi.js");
const Constant_1 = require("../Constant");
/**
 * 높이를 나타내는 zIndex 는 y 값에 따라 보정이 필요하므로 해당 값만큼의 y값에 따른 보정이 가능하도록 함.
 * 따라서, 맵의 크기가 Z_INDEX_MOD 값보다 크면 문제가 될 수 있음
 */
const Z_INDEX_MOD = 10000;
exports.DEFAULT_ANIMATION_SPEED = 6 / Constant_1.FRAMES_PER_SECOND; // 10 fps
class IObject extends pixi_js_1.Container {
    constructor(name, iSpriteMap) {
        super();
        this.iSpriteMap = iSpriteMap;
        this.loaded = false;
        this.dir = 'down';
        this.iZIndex = 1;
        this.name = name;
        this.iSprite = this.iSpriteMap.default;
    }
    async load() {
        await Promise.all(Object.values(this.iSpriteMap).map((iSprite) => iSprite.load()));
        this.addChild(this.getSprite());
        this.loaded = true;
    }
    isLoaded() {
        return this.loaded;
    }
    getSprite() {
        const sprite = this.iSprite.getSprite(this.dir);
        if (!sprite) {
            throw new Error('[IObject.getSprite] no iSprite');
        }
        return sprite;
    }
    getCollisionMod() {
        const collisionMod = this.iSprite.getCollisionMod(this.dir);
        if (!collisionMod) {
            throw new Error('[IObject.getSprite] no collision mod');
        }
        return collisionMod;
    }
    getCollisionArea() {
        const [x, y] = this.getPos();
        const [, , colsW, colsH] = this.getCollisionMod();
        return [x, y, colsW, colsH];
    }
    getWidth() {
        return this.getCollisionMod()[2];
    }
    getHeight() {
        return this.getCollisionMod()[3];
    }
    getZIndex() {
        return this.iZIndex;
    }
    setZIndex(zIndex) {
        this.iZIndex = zIndex;
        const [, y] = this.getPos();
        this.zIndex = this.iZIndex * Z_INDEX_MOD + y;
        return this;
    }
    getPos() {
        const [modX, modY] = this.getCollisionMod();
        return [this.x + modX, this.y + modY];
    }
    setPos([x, y]) {
        const [modX, modY] = this.getCollisionMod();
        this.x = x - modX;
        this.y = y - modY;
        this.setZIndex(this.iZIndex);
        return this;
    }
    getDirection() {
        return this.dir;
    }
    setDirection(nextDir) {
        const lastDir = this.dir;
        if (lastDir === nextDir) {
            return this;
        }
        if (!this.isLoaded()) {
            this.dir = nextDir;
            return this;
        }
        const curSprite = this.getSprite();
        this.dir = nextDir;
        const nextSprite = this.getSprite();
        if (curSprite instanceof pixi_js_1.AnimatedSprite) {
            this.stop();
        }
        this.removeChild(curSprite);
        this.addChild(nextSprite);
        return this;
    }
    /**
     * loop animation
     * @param speed
     * @returns
     */
    play(speed = 1) {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            throw new Error('[IObject.play] Not an animation.');
        }
        if (sprite.playing) {
            return this;
        }
        sprite.loop = true;
        sprite.play();
        sprite.animationSpeed = speed * exports.DEFAULT_ANIMATION_SPEED;
        return this;
    }
    stop() {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            return this;
        }
        if (!sprite.playing) {
            return this;
        }
        sprite.stop();
        return this;
    }
    getCenterPos() {
        const [x, y] = this.getPos();
        return [x + this.getWidth() / 2, y + this.getHeight() / 2];
    }
    change(spriteKey) {
        const nextSprite = this.iSpriteMap[spriteKey];
        if (!nextSprite) {
            throw new Error('[IObject.change] No the sprite.');
        }
        this.removeChild(this.getSprite());
        this.stop();
        this.iSprite = nextSprite;
        this.addChild(this.iSprite.getSprite(this.dir));
        const lastSprite = this.getSprite();
        if (lastSprite instanceof pixi_js_1.AnimatedSprite) {
            this.stop();
        }
    }
}
exports.default = IObject;
