"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
/**
 * 높이를 나타내는 zIndex 는 y 값에 따라 보정이 필요하므로 해당 값만큼의 y값에 따른 보정이 가능하도록 함.
 * 따라서, 맵의 크기가 Z_INDEX_MOD 값보다 크면 문제가 될 수 있음
 */
const Z_INDEX_MOD = 10000;
const TEXTURE_MAP = {};
const getTexture = (spriteUrl) => {
    if (!TEXTURE_MAP[spriteUrl]) {
        TEXTURE_MAP[spriteUrl] = pixi_js_1.BaseTexture.from(spriteUrl);
    }
    return TEXTURE_MAP[spriteUrl];
};
const areaListToFrame = (prefix) => (areaList) => {
    if (!areaList) {
        return {};
    }
    return areaList.reduce((frames, [x, y, w, h], idx) => ({
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
    throw new Error(`Fail to get sprite. invalid frameKeyList. ${JSON.stringify(frameKeyList)}`);
};
class IObject extends pixi_js_1.Container {
    constructor(props) {
        var _a;
        super();
        this.props = props;
        this.name = props.name;
        this.frameMap = areaListToFrame(`${props.name}-frame`)(props.spriteAreaList);
        this.setZIndex((_a = this.props.zIndex) !== null && _a !== void 0 ? _a : 1);
    }
    async load() {
        var _a;
        if (this.sprite) {
            return;
        }
        await new pixi_js_1.Spritesheet(getTexture(this.props.spriteUrl), {
            frames: this.frameMap,
            meta: {
                scale: '1',
            },
        }).parse();
        this.sprite = getSprite(Object.keys(this.frameMap), (_a = this.props.loop) !== null && _a !== void 0 ? _a : false);
        this.addChild(this.sprite);
        if (this.props.pos) {
            this.setPos(this.props.pos);
        }
    }
    isLoaded() {
        return !!this.sprite;
    }
    getSprite() {
        if (!this.sprite) {
            throw new Error(`"${this.name}" is not loaded.`);
        }
        return this.sprite;
    }
    getCollisionMod() {
        this.getSprite();
        if (this.props.collisionMod) {
            return this.props.collisionMod;
        }
        return [this.x, this.y, this.width, this.height];
    }
    getCollisionArea() {
        this.getSprite();
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
        return Math.floor(this.zIndex / Z_INDEX_MOD);
    }
    setZIndex(_zIndex) {
        const zIndex = _zIndex !== null && _zIndex !== void 0 ? _zIndex : Math.floor(this.zIndex / Z_INDEX_MOD);
        this.zIndex = zIndex * Z_INDEX_MOD + this.y;
        return this;
    }
    getPos() {
        this.getSprite();
        const [modX, modY] = this.getCollisionMod();
        return [this.x + modX, this.y + modY];
    }
    setPos([x, y]) {
        this.getSprite();
        const [modX, modY] = this.getCollisionMod();
        this.x = x - modX;
        this.y = y - modY;
        this.setZIndex();
        return this;
    }
    isAnimation() {
        const sprite = this.getSprite();
        return sprite instanceof pixi_js_1.AnimatedSprite;
    }
    play(acc) {
        if (!this.isAnimation()) {
            throw new Error(`Fail to play animation. "${this.name}" is not an animation.`);
        }
        console.error('acc', acc);
        this.play();
        return this;
    }
    stop() {
        if (!this.isAnimation()) {
            throw new Error(`Fail to stop animation. "${this.name}" is not an animation.`);
        }
        this.stop();
        return this;
    }
}
exports.default = IObject;
