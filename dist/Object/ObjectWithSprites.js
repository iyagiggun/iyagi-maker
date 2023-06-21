"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ISprite_1 = require("./ISprite");
const ObjectBase_1 = __importDefault(require("./ObjectBase"));
class ObjectWithSprites extends ObjectBase_1.default {
    constructor(name, spriteMap) {
        super(name);
        this.doing = false;
        this.spriteMap = spriteMap;
    }
    async load() {
        await Promise.all(Object.values(this.spriteMap).map((sprite) => sprite.load()));
        this.current = this.spriteMap.default;
    }
    getSprite() {
        if (!this.current) {
            throw new Error(`Fail to get "${this.getName()}" sprite.`);
        }
        return this.current;
    }
    getWidth() {
        return this.getSprite().getWidth();
    }
    getHeight() {
        return this.getSprite().getHeight();
    }
    getCollisionCoords() {
        return this.getSprite().getCollisionCoords();
    }
    getDirection() {
        return this.getSprite().getDirection();
    }
    changeDirection(deltaX, deltaY) {
        return this.setDirection((0, ISprite_1.getDirection)(deltaX, deltaY));
    }
    setDirection(direction) {
        this.getSprite().setDirection(direction);
        return this;
    }
    getPos() {
        return this.getSprite().getPos();
    }
    setPos(x, y, zMod = 0) {
        this.getSprite().setPos(x, y, zMod);
        return this;
    }
    getGlobalPos() {
        return this.getSprite().getGlobalPos();
    }
    play(acc = 1) {
        this.getSprite().play(acc);
        return this;
    }
    isPlaying() {
        return this.getSprite().isPlaying();
    }
    stop() {
        this.getSprite().stop();
        return this;
    }
    hide() {
        this.getSprite().hide();
        return this;
    }
    show() {
        this.getSprite().show();
        return this;
    }
    do(spriteName) {
        return new Promise((resolve) => {
            if (this.doing) {
                resolve();
                return;
            }
            const lastSprite = this.getSprite();
            const spriteDo = this.spriteMap[spriteName];
            if (!spriteDo) {
                throw new Error(`Fail to do "${spriteName}". no the sprite.`);
            }
            lastSprite.replace(spriteDo);
            this.current = spriteDo;
            if (!spriteDo.isAnimation()) {
                resolve();
                return;
            }
            spriteDo.play(undefined, 0);
            if (spriteDo.isLoopAnimation()) {
                resolve();
                return;
            }
            this.doing = true;
            spriteDo.addEventListener('onComplete', () => {
                spriteDo.replace(lastSprite);
                this.current = lastSprite;
                this.doing = false;
                resolve();
            }, { once: true });
        });
    }
    isDoing() {
        return this.doing;
    }
}
exports.default = ObjectWithSprites;
