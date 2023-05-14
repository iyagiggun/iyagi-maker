"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const Constant_1 = require("../Constant");
const Coordinate_1 = require("../Utils/Coordinate");
const textureMap = {};
const DEFAULT_PHOTO_INFO = { default: Constant_1.TRANSPARENT_1PX_IMG };
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
        this.passable = (_a = objInfo.passable) !== null && _a !== void 0 ? _a : false;
        this.photo = new pixi_js_1.Sprite();
    }
    getDirFrames() {
        var _a, _b, _c;
        return {
            up: coordsListToFrame(`${this.name}-up`)((_a = this.objInfo.up) === null || _a === void 0 ? void 0 : _a.coordsList),
            down: coordsListToFrame(`${this.name}-down`)(this.objInfo.down.coordsList),
            left: coordsListToFrame(`${this.name}-left`)((_b = this.objInfo.left) === null || _b === void 0 ? void 0 : _b.coordsList),
            right: coordsListToFrame(`${this.name}-right`)((_c = this.objInfo.right) === null || _c === void 0 ? void 0 : _c.coordsList),
        };
    }
    isLoaded() {
        return !!this.sprite;
    }
    async load() {
        var _a;
        // case: loaded
        if (this.isLoaded()) {
            return;
        }
        // case: still not loaded
        // Load Texture
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
            },
        }).parse();
        this.upS = getSprite(Object.keys(dirFrames.up));
        this.downS = getSprite(Object.keys(dirFrames.down));
        this.leftS = getSprite(Object.keys(dirFrames.left));
        this.rightS = getSprite(Object.keys(dirFrames.right));
        this.setDirection(this.objInfo.dir || 'down');
        this.getSprite().visible = (_a = this.objInfo.visible) !== null && _a !== void 0 ? _a : true;
        const [posX, posY, zMod] = this.objInfo.pos || [0, 0];
        this.setPos(posX, posY, zMod);
        // Load Photo
        const photoInfo = this.objInfo.photoInfo || DEFAULT_PHOTO_INFO;
        const photoKeys = Object.keys(photoInfo);
        photoKeys.forEach((key) => pixi_js_1.Assets.add(`${this.name}:${key}`, photoInfo[key]));
        this.photoTextureMap = await pixi_js_1.Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
        this.photo.texture = this.photoTextureMap[`${this.name}:default`];
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
    getSprite() {
        if (!this.sprite) {
            throw new Error(`asset '${this.name}' is not loaded`);
        }
        return this.sprite;
    }
    getCollisionMod() {
        if (!this.collisionMod) {
            const sprite = this.getSprite();
            return [0, 0, sprite.width, sprite.height];
        }
        return this.collisionMod;
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
    getTexture() {
        const { spriteUrl } = this.objInfo;
        if (!textureMap[spriteUrl]) {
            textureMap[spriteUrl] = pixi_js_1.BaseTexture.from(spriteUrl);
        }
        return textureMap[spriteUrl];
    }
    getPos() {
        const [modX, modY] = this.getCollisionMod();
        const { x: spriteX, y: spriteY } = this.getSprite();
        return [spriteX + modX, spriteY + modY];
    }
    setPos(x, y, zMod = 0) {
        const [modX, modY] = this.getCollisionMod();
        const sprite = this.getSprite();
        sprite.x = x - modX;
        sprite.y = y - modY;
        sprite.zIndex = sprite.y + sprite.height + zMod;
        return this;
    }
    getWidth() {
        return this.getCollisionMod()[Coordinate_1.COORDS_W_IDX];
    }
    getHeight() {
        return this.getCollisionMod()[Coordinate_1.COORDS_H_IDX];
    }
    getGlobalPos() {
        const [modX, modY] = this.getCollisionCoords();
        const { x: globalX, y: globalY } = this.getSprite().getGlobalPosition();
        return [globalX + modX, globalY + modY];
    }
    getCollisionCoords() {
        const [x, y] = this.getPos();
        const [, , colsW, colsH] = this.getCollisionMod();
        return [x, y, colsW, colsH];
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
        var _a, _b, _c;
        const lastSprite = this.sprite;
        const [lastX, lastY] = lastSprite ? this.getPos() : [0, 0];
        switch (direction) {
            case 'up':
                this.sprite = this.upS;
                this.collisionMod = (_a = this.objInfo.up) === null || _a === void 0 ? void 0 : _a.collisionCoords;
                break;
            case 'down':
                this.sprite = this.downS;
                this.collisionMod = this.objInfo.down.collisionCoords;
                break;
            case 'left':
                this.sprite = this.leftS;
                this.collisionMod = (_b = this.objInfo.left) === null || _b === void 0 ? void 0 : _b.collisionCoords;
                break;
            case 'right':
                this.sprite = this.rightS;
                this.collisionMod = (_c = this.objInfo.right) === null || _c === void 0 ? void 0 : _c.collisionCoords;
                break;
            default:
                throw new Error(`Fail to change ${this.name} dir. Invalid direction. ${direction}`);
        }
        if (!this.sprite) {
            throw new Error(`Fail to change ${this.name} dir. no sprite. ${direction}`);
        }
        if (!lastSprite) {
            return this;
        }
        this.setPos(lastX, lastY);
        const { parent } = lastSprite;
        if (parent) {
            if (lastSprite instanceof pixi_js_1.AnimatedSprite) {
                lastSprite.stop();
            }
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
    isPlaying() {
        if (!(this.sprite instanceof pixi_js_1.AnimatedSprite)) {
            return false;
        }
        return this.sprite.playing;
    }
    stop() {
        const sprite = this.getSprite();
        if (!(sprite instanceof pixi_js_1.AnimatedSprite)) {
            return;
        }
        sprite.stop();
    }
    hide() {
        this.getSprite().visible = false;
    }
    show() {
        this.getSprite().visible = true;
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
}
exports.default = IObject;
