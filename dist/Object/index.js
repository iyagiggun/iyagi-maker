"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const Constant_1 = require("../Constant");
const DEFAULT_PHOTO_INFO = { default: Constant_1.TRANSPARENT_1PX_IMG };
const getDirection = (deltaX, deltaY) => {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
    }
    return deltaY > 0 ? 'down' : 'up';
};
class IObject {
    constructor(name, info) {
        var _a;
        this.name = name;
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
        await Promise.all(Object.values(this.info.sprites).map((sprite) => sprite.load()));
        this.isprite = this.info.sprites.default;
        const [posX, posY, zMod] = this.info.pos || [0, 0];
        this.setPos(posX, posY, zMod);
        // Load Photo
        const photoInfo = this.info.photoInfo || DEFAULT_PHOTO_INFO;
        const photoKeys = Object.keys(photoInfo);
        photoKeys.forEach((key) => pixi_js_1.Assets.add(`${this.name}:${key}`, photoInfo[key]));
        this.photoTextureMap = await pixi_js_1.Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
        this.photo.texture = this.photoTextureMap[`${this.name}:default`];
        this.loaded = true;
    }
    getName() {
        return this.name;
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
    getISprite() {
        if (!this.isprite) {
            throw new Error(`Fail to get "${this.name}" sprite.`);
        }
        return this.isprite;
    }
    getCollisionMod() {
        return this.getISprite().getCollisionMod();
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
    getPos() {
        return this.getISprite().getPos();
    }
    setPos(x, y, zMod = 0) {
        this.getISprite().setPos(x, y, zMod);
        return this;
    }
    getWidth() {
        return this.getISprite().getWidth();
    }
    getHeight() {
        return this.getISprite().getHeight();
    }
    getGlobalPos() {
        return this.getISprite().getGlobalPos();
    }
    getCollisionCoords() {
        return this.getISprite().getCollisionCoords();
    }
    getDirection() {
        return this.getISprite().getDirection();
    }
    changeDirection(deltaX, deltaY) {
        return this.setDirection(getDirection(deltaX, deltaY));
    }
    setDirection(direction) {
        this.getISprite().setDirection(direction);
        return this;
    }
    play(_speed) {
        this.getISprite().play(_speed);
        return this;
    }
    isPlaying() {
        return this.getISprite().isPlaying();
    }
    stop() {
        this.getISprite().stop();
        return this;
    }
    hide() {
        this.getISprite().hide();
        return this;
    }
    show() {
        this.getISprite().show();
        return this;
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
    attach(container) {
        if (!this.isprite) {
            throw new Error(`Fail to attach "${this.name}". no sprite.`);
        }
        this.isprite.attach(container);
    }
    detach(container) {
        if (!this.isprite) {
            throw new Error(`Fail to detach "${this.name}". no sprite.`);
        }
        this.isprite.detach(container);
    }
}
exports.default = IObject;
