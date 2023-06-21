"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const Constant_1 = require("../Constant");
const ObjectWithSprites_1 = __importDefault(require("./ObjectWithSprites"));
const DEFAULT_PHOTO_INFO = { default: Constant_1.TRANSPARENT_1PX_IMG };
class IObject extends ObjectWithSprites_1.default {
    constructor(name, info) {
        var _a;
        super(name, info.sprites);
        this.info = info;
        this.loaded = false;
        this.passable = (_a = info.passable) !== null && _a !== void 0 ? _a : false;
        this.photo = new pixi_js_1.Sprite();
    }
    isLoaded() {
        return this.loaded;
    }
    async load() {
        if (this.loaded) {
            return;
        }
        await super.load();
        const [posX, posY, zMod] = this.info.pos || [0, 0];
        this.setPos(posX, posY, zMod);
        // Load Photo
        const name = this.getName();
        const photoInfo = this.info.photoInfo || DEFAULT_PHOTO_INFO;
        const photoKeys = Object.keys(photoInfo);
        photoKeys.forEach((key) => pixi_js_1.Assets.add(`${name}:${key}`, photoInfo[key]));
        this.photoTextureMap = await pixi_js_1.Assets.load(photoKeys.map((key) => `${name}:${key}`));
        this.photo.texture = this.photoTextureMap[`${name}:default`];
        this.loaded = true;
    }
    getPhoto() {
        return this.photo;
    }
    changePhoto(key) {
        if (!this.photoTextureMap) {
            throw new Error('No photo texture map.');
        }
        // 없으면 pixi.js 에서 알아서 에러 생성해줌
        this.photo.texture = this.photoTextureMap[key];
    }
    setReaction(reaction) {
        this.reaction = reaction;
    }
    getReaction() {
        return this.reaction;
    }
    async react() {
        var _a;
        await ((_a = this.reaction) === null || _a === void 0 ? void 0 : _a.call(this));
    }
    isPassable() {
        return this.passable;
    }
    getCenterPos() {
        const [x, y] = this.getPos();
        return [x + this.getWidth() / 2, y + this.getHeight() / 2];
    }
    getCoordinateRelationship(target) {
        const [x, y] = this.getCenterPos();
        const halfWidth = this.getWidth() / 2;
        const halfHeight = this.getHeight() / 2;
        const [tx, ty] = target.getCenterPos();
        const tHalfWidth = target.getWidth() / 2;
        const tHalfHeight = target.getHeight() / 2;
        const xDiff = tx - x;
        const yDiff = ty - y;
        // y 축이 동일하면 삼각함수 못씀
        if (xDiff === 0) {
            const distance = Math.abs(yDiff - halfHeight - tHalfHeight);
            return {
                distance, xDiff, yDiff,
            };
        }
        // x 축이 동일하면 삼각함수 못씀
        if (yDiff === 0) {
            const distance = Math.abs(xDiff - halfWidth - tHalfWidth);
            return {
                distance, xDiff, yDiff,
            };
        }
        // 중심점 간 거리
        const cDistance = Math.sqrt(xDiff ** 2 + yDiff ** 2);
        // x 축으로 겹쳐 있다면 sin 으로 구해야 함.
        if (xDiff < halfWidth + tHalfWidth) {
            const arcSin = Math.abs(cDistance / yDiff);
            const distance = cDistance - arcSin * halfHeight - arcSin * tHalfHeight;
            return {
                distance, xDiff, yDiff,
            };
        }
        // y축으로 겹쳐있거나 나머지의 경우는 cos 으로 구함.
        const arcCos = Math.abs(cDistance / xDiff);
        const distance = cDistance - arcCos * halfWidth - arcCos * tHalfWidth;
        return {
            distance, xDiff, yDiff,
        };
    }
    attachAt(container) {
        this.getSprite().attachAt(container);
    }
    detach() {
        this.getSprite().detach();
    }
}
exports.default = IObject;
