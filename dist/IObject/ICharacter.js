"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const IObject_1 = __importDefault(require("./IObject"));
const Constant_1 = require("../Constant");
const DEFAULT_PHOTO_INFO = { default: Constant_1.TRANSPARENT_1PX_IMG };
class ICharacter extends pixi_js_1.Container {
    constructor(props) {
        super();
        this.props = props;
        this.loaded = false;
        this.iObjectMap = {};
        this.name = props.name;
        this.iObjectMap = Object.keys(this.props.iObjectMap).reduce((acc, key) => {
            const subIObjectProps = this.props.iObjectMap[key];
            if (subIObjectProps) {
                acc[key] = new IObject_1.default({
                    name: `${this.name}:${key}`,
                    spriteUrl: this.props.spriteUrl,
                    ...subIObjectProps,
                });
            }
            return acc;
        }, {});
        this.status = props.status;
        const direction = props.direction || 'down';
        const current = this.iObjectMap[direction];
        if (!current) {
            throw new Error(`Fail to create "${this.name}". There is now ${direction} IObject`);
        }
        this.current = current;
    }
    async load() {
        if (this.loaded) {
            return;
        }
        await Promise.all(Object.values(this.iObjectMap).map((iObject) => iObject === null || iObject === void 0 ? void 0 : iObject.load()));
        const photoMap = this.props.photoMap || DEFAULT_PHOTO_INFO;
        const photoKeys = Object.keys(photoMap);
        photoKeys.forEach((key) => pixi_js_1.Assets.add(`${this.name}:${key}`, photoMap[key]));
        this.photoTextureMap = await pixi_js_1.Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
        this.photo = new pixi_js_1.Sprite();
        this.photo.texture = this.photoTextureMap[`${this.name}:default`];
        this.loaded = true;
        this.setDirection(this.props.direction || 'down');
    }
    isLoaded() {
        return this.loaded;
    }
    loadCheck() {
        if (!this.loaded) {
            throw new Error(`"${this.name}" is not loaded.`);
        }
    }
    getCollisionMod() {
        this.loadCheck();
        return this.current.getCollisionMod();
    }
    getCollisionArea() {
        this.loadCheck();
        return this.current.getCollisionArea();
    }
    getWidth() {
        this.loadCheck();
        return this.current.getWidth();
    }
    getHeight() {
        this.loadCheck();
        return this.current.getHeight();
    }
    getZIndex() {
        this.loadCheck();
        return this.current.getZIndex();
    }
    setZIndex(zIndex) {
        this.loadCheck();
        this.current.setZIndex(zIndex);
        return this;
    }
    getPos() {
        this.loadCheck();
        const [modX, modY] = this.getCollisionMod();
        return [this.x + modX, this.y + modY];
    }
    setPos([x, y]) {
        this.loadCheck();
        const [modX, modY] = this.getCollisionMod();
        this.x = x - modX;
        this.y = y - modY;
        this.zIndex = this.getZIndex() + y;
        return this;
    }
    getDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        const direction = directions.find((dir) => this.current === this.iObjectMap[dir]);
        if (!direction) {
            throw new Error('Fail to get direction. no direciton.');
        }
        return direction;
    }
    setDirection(dir) {
        const nextIObj = this.iObjectMap[dir];
        if (!nextIObj) {
            throw new Error(`Fail to set direction. there is no "${dir}" IObject.`);
        }
        const lastPos = this.getPos();
        this.removeChild(this.current);
        this.current = nextIObj;
        this.current.setPos(lastPos);
        this.addChild(this.current);
    }
    isAnimation() {
        this.loadCheck();
        return this.current.isAnimation();
    }
    play(acc) {
        this.loadCheck();
        this.current.play(acc);
        return this;
    }
    stop() {
        this.loadCheck();
        this.current.stop();
        return this;
    }
    getPhoto() {
        if (!this.photo) {
            throw new Error(`Fail to get photo. "${this.name}" is not loaded.`);
        }
        return this.photo;
    }
    isDoing() {
        console.error(this.name);
        return false;
    }
}
exports.default = ICharacter;
