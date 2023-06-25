"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z_INDEX_MOD = void 0;
const pixi_js_1 = require("pixi.js");
const Constant_1 = require("../Constant");
/**
 * 높이를 나타내는 zIndex 는 y 값에 따라 보정이 필요하므로 해당 값만큼의 y값에 따른 보정이 가능하도록 함.
 * 따라서, 맵의 크기가 Z_INDEX_MOD 값보다 크면 문제가 될 수 있음
 */
exports.Z_INDEX_MOD = 10000;
const DEFAULT_ANIMATION_SPEED = 6 / Constant_1.FRAMES_PER_SECOND; // 10 fps
class IObject extends pixi_js_1.Container {
    constructor(props) {
        var _a;
        super();
        this.props = props;
        this.name = props.name;
        this.dir = this.props.dir || 'down';
        this.setZIndex((_a = this.props.zIndex) !== null && _a !== void 0 ? _a : 1);
    }
    async load() {
        if (this.curISpriteKey) {
            return;
        }
        await Promise.all(Object.values(this.props.iSpriteMap).map((iSprite) => iSprite.load()));
        this.curISpriteKey = 'default';
        this.addChild(this.getSprite());
        if (this.props.pos) {
            this.setPos(this.props.pos);
        }
    }
    isLoaded() {
        return !!this.curISpriteKey;
    }
    getISprite() {
        if (!this.curISpriteKey) {
            throw new Error(`[IObject.getISprite] Not loaded. "${this.name}"`);
        }
        const iSprite = this.props.iSpriteMap[this.curISpriteKey];
        return iSprite;
    }
    getSprite() {
        return this.getISprite().getSprite(this.dir);
    }
    getCollisionMod() {
        if (!this.curISpriteKey) {
            throw new Error(`[IObject.getCollisionMod] Not loaded. "${this.name}"`);
        }
        return this.getISprite().getCollisionMod(this.dir);
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
        return Math.floor(this.zIndex / exports.Z_INDEX_MOD);
    }
    setZIndex(_zIndex) {
        const zIndex = _zIndex !== null && _zIndex !== void 0 ? _zIndex : Math.floor(this.zIndex / exports.Z_INDEX_MOD);
        this.zIndex = zIndex * exports.Z_INDEX_MOD + this.y + this.height;
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
        this.setZIndex();
        return this;
    }
    getDirection() {
        return this.dir;
    }
    setDirection(nextDir) {
        const lastDir = this.dir;
        const curSprite = this.getSprite();
        if (lastDir === nextDir) {
            return;
        }
        try {
            const nextSprite = this.getISprite().getSprite(nextDir);
            this.removeChild(curSprite);
            this.addChild(nextSprite);
            this.dir = nextDir;
        }
        catch (e) {
            this.dir = lastDir;
            throw e;
        }
    }
    play(acc = 1, playPosition) {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            throw new Error(`[IObject.play] Not AnimatedSprite. "${this.name}". "${this.curISpriteKey}. "${this.dir}"`);
        }
        if (!sprite.playing) {
            if (playPosition === undefined) {
                sprite.play();
            }
            else {
                sprite.gotoAndPlay(playPosition);
            }
        }
        sprite.animationSpeed = acc * DEFAULT_ANIMATION_SPEED;
        return this;
    }
    stop() {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            throw new Error(`Fail to stop animation. "${this.name}" is not an animation.`);
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
}
exports.default = IObject;
