"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const Constant_1 = require("../Constant");
const Calc_1 = require("../Scene/Calc");
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
    async load() {
        var _a;
        // case: loaded
        if (this.sprite) {
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
        this.setDirection('down');
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
    attachAt(container) {
        container.addChild(this.getSprite());
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
    }
    getWidth() {
        return this.getCollisionMod()[Calc_1.COORDS_W_IDX];
    }
    getHeight() {
        return this.getCollisionMod()[Calc_1.COORDS_H_IDX];
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
        const [lastX, lastY] = lastSprite ? this.getPos() : [];
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
