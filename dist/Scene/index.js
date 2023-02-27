"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const throttle_1 = __importDefault(require("lodash-es/throttle"));
const pixi_js_1 = require("pixi.js");
const Constant_1 = require("../Constant");
const Tile_1 = require("../Object/Tile");
const getAcc = (distance) => {
    if (distance < 24) {
        return 0;
    }
    if (distance < 48) {
        return 1;
    }
    if (distance < 72) {
        return 2;
    }
    return 3;
};
class IScene extends pixi_js_1.Container {
    constructor(name, tiles, objectList) {
        super();
        this.tiles = tiles;
        this.objectList = objectList;
        this.name = name;
    }
    setApplication(app) {
        this.app = app;
    }
    getApplication() {
        if (!this.app) {
            throw new Error(`[scene: ${this.name}] no application.`);
        }
        return this.app;
    }
    load() {
        return Promise.all([
            ...this.tiles.reduce((acc, item) => acc.concat(item)).map(tile => tile.load()),
            ...this.objectList.map((obj) => obj.load())
        ]);
    }
    drawMap() {
        this.tiles.forEach((row, rowIdx) => row.forEach((tile, colIdx) => {
            const sprite = tile.getSprite();
            sprite.x = colIdx * Tile_1.TILE_SIZE;
            sprite.y = rowIdx * Tile_1.TILE_SIZE;
            this.addChild(sprite);
        }));
        this.objectList.forEach((obj) => {
            this.addChild(obj.getSprite());
        });
    }
    interact() {
        console.error('interact!!');
    }
    controll(target) {
        if (!this.controller) {
            const { width: appWidth, height: appHeight } = this.getApplication().view;
            let joystickId = undefined;
            let [startX, startY] = [0, 0];
            let [deltaX, deltaY] = [0, 0];
            this.controller = pixi_js_1.Sprite.from(Constant_1.TRANSPARENT_1PX_IMG);
            this.controller.width = appWidth;
            this.controller.height = appHeight;
            this.controller.interactive = true;
            const ticker = this.getApplication().ticker;
            const tick = () => {
                const [curX, curY] = target.getPos();
                const nextX = this.getObjectNextX(target, deltaX);
                const nextY = this.getObjectNextY(target, deltaY);
                this.x += curX - nextX;
                this.y += curY - nextY;
                target.setPos(nextX, nextY);
            };
            this.controller.addEventListener('touchstart', (evt) => {
                const { x, y } = evt.global;
                if (joystickId === undefined && x < appWidth / 2) {
                    startX = x;
                    startY = y;
                    joystickId = evt.pointerId;
                    ticker.add(tick);
                }
                else {
                    this.interact();
                }
            });
            this.controller.addEventListener('touchmove', (0, throttle_1.default)((evt) => {
                if (joystickId !== evt.pointerId) {
                    return;
                }
                const { x, y } = evt.global;
                const diffX = x - startX;
                const diffY = y - startY;
                const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
                if (distance === 0) {
                    return;
                }
                const acc = getAcc(distance);
                if (acc === 0) {
                    deltaX = 0;
                    deltaY = 0;
                    target.stop();
                    return;
                }
                deltaX = Math.round((diffX * acc) / distance);
                deltaY = Math.round((diffY * acc) / distance);
                target.changeDirectionWithDelta(deltaX, deltaY);
                target.play(acc);
            }, 50));
            this.controller.addEventListener('touchend', () => {
                joystickId = undefined;
                target.stop();
                ticker.remove(tick);
            });
            this.parent.addChild(this.controller);
        }
    }
    getObjectNextX(obj, dist) {
        const [curX, curY] = obj.getPos();
        const width = obj.getWidth();
        const height = obj.getHeight();
        const nextX = curX + dist;
        // const blockingObj = this.#impassbleMap.concat(this.#collisionObjList)
        //   .find((target) => {
        //     if (target === obj) {
        //       return false;
        //     }
        //     const { x: targetX, y: targetY } = target.getPos();
        //     return isIntersecting(
        //       nextX, curY, width, height, targetX,
        //       targetY, target.getWidth(), target.getHeight(),
        //     );
        //   });
        // if (!blockingObj) {
        return nextX;
        // }
        // const blockingObjX = blockingObj.getPos().x;
        // return curX < blockingObjX ? blockingObjX - width : blockingObjX + blockingObj.getWidth();
    }
    getObjectNextY(obj, dist) {
        const [curX, curY] = obj.getPos();
        const width = obj.getWidth();
        const height = obj.getHeight();
        const nextY = curY + dist;
        // const blockingObj = this.#impassbleMap.concat(this.#collisionObjList)
        //   .find((target) => {
        //     if (target === obj) {
        //       return false;
        //     }
        //     const { x: targetX, y: targetY } = target.getPos();
        //     return isIntersecting(
        //       curX, nextY, width, height, targetX,
        //       targetY, target.getWidth(), target.getHeight(),
        //     );
        //   });
        // if (!blockingObj) {
        return nextY;
        // }
        // const blockingObjY = blockingObj.getPos().y;
        // return curY < blockingObjY ? blockingObjY - width : blockingObjY + blockingObj.getHeight();
    }
}
exports.default = IScene;
