"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_es_1 = require("lodash-es");
const pixi_js_1 = require("pixi.js");
const Constant_1 = require("../Constant");
const Coordinate_1 = require("../Utils/Coordinate");
const SceneCamera_1 = __importDefault(require("./SceneCamera"));
const TalkBox_1 = require("./TalkBox");
const REACTION_OVERLAP_THRESHOLD = 10;
const getDirection = (deltaX, deltaY) => {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
    }
    return deltaY > 0 ? 'down' : 'up';
};
class SceneController extends SceneCamera_1.default {
    constructor() {
        super(...arguments);
        this.controlMode = 'peace';
    }
    control(player, mode) {
        if (!this.controller) {
            const { width: appWidth, height: appHeight } = this.getApplication().view;
            let joystickId;
            let [startX, startY] = [0, 0];
            let [deltaX, deltaY] = [0, 0];
            const controller = pixi_js_1.Sprite.from(Constant_1.TRANSPARENT_1PX_IMG);
            this.controller = controller;
            this.controller.width = appWidth;
            this.controller.height = appHeight;
            const { ticker } = this.getApplication();
            const tick = () => {
                const nextX = this.getObjectNextX(player, deltaX);
                const nextY = this.getObjectNextY(player, deltaY);
                player.setPos([nextX, nextY]);
                const [cameraX, cameraY] = this.getCameraPos(player);
                this.container.x = cameraX;
                this.container.y = cameraY;
            };
            const onTouchStart = (evt) => {
                const { x, y } = evt.global;
                if (x < appWidth / 2) {
                    // case:: joystick on
                    startX = x;
                    startY = y;
                    joystickId = evt.pointerId;
                    ticker.add(tick);
                }
                else {
                    console.error(this.controlMode);
                    // case:: interact
                    const interaction = this.getInteraction();
                    if (!interaction) {
                        return;
                    }
                    controller.interactive = false;
                    joystickId = undefined;
                    player.stop();
                    ticker.remove(tick);
                    interaction().then(() => {
                        controller.interactive = true;
                    });
                }
            };
            const onTouchMove = (0, lodash_es_1.throttle)((evt) => {
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
                const acc = (0, Coordinate_1.getAcc)(distance);
                if (acc === 0) {
                    deltaX = 0;
                    deltaY = 0;
                    player.stop();
                    return;
                }
                deltaX = Math.round((diffX * acc) / distance);
                deltaY = Math.round((diffY * acc) / distance);
                player.setDirection(getDirection(deltaX, deltaY));
                player.play(acc);
            }, 50);
            const onTouchEnd = (evt) => {
                if (joystickId !== evt.pointerId) {
                    return;
                }
                joystickId = undefined;
                player.stop();
                ticker.remove(tick);
            };
            this.controller.addEventListener('touchstart', onTouchStart);
            this.controller.addEventListener('touchmove', onTouchMove);
            this.controller.addEventListener('touchend', onTouchEnd);
            this.controller.addEventListener('touchendoutside', onTouchEnd);
            this.container.parent.addChild(this.controller);
            const [cameraX, cameraY] = this.getCameraPos(player);
            this.container.x = cameraX;
            this.container.y = cameraY;
        }
        this.controlMode = mode;
        this.controller.interactive = true;
        this.player = player;
    }
    getInteraction() {
        const { player } = this;
        if (!player) {
            throw new Error(`[scene: ${this.name}] no player`);
        }
        const playerDirection = player.getDirection();
        const [px, py] = player.getPos();
        const pWidth = player.getWidth();
        const cHeight = player.getHeight();
        const cCenterX = px + pWidth / 2;
        const cCenterY = py + cHeight / 2;
        const target = this.objectList.find((obj) => {
            const [oX, oY] = obj.getPos();
            switch (playerDirection) {
                case 'down':
                    return (Math.abs(cCenterX - (oX + obj.getWidth() / 2))
                        < REACTION_OVERLAP_THRESHOLD && Math.abs(py + cHeight - oY) < 2);
                case 'up':
                    return (Math.abs(cCenterX - (oX + obj.getWidth() / 2))
                        < REACTION_OVERLAP_THRESHOLD && Math.abs(oY + obj.getHeight() - py) < 2);
                case 'left':
                    return (Math.abs(cCenterY - (oY + obj.getHeight() / 2))
                        < REACTION_OVERLAP_THRESHOLD && Math.abs(oX + obj.getWidth() - px) < 2);
                case 'right':
                    return (Math.abs(cCenterY - (oY + obj.getHeight() / 2))
                        < REACTION_OVERLAP_THRESHOLD && Math.abs(px + pWidth - oX) < 2);
                default:
                    return false;
            }
        });
        if (!target) {
            return null;
        }
        return target.reaction;
    }
    talk(speaker, message) {
        const { player } = this;
        return new Promise((resolve) => {
            const app = this.getApplication();
            const { talkBox, talkEndPromise } = (0, TalkBox_1.getTalkBox)(speaker, message, app.view);
            app.stage.addChild(talkBox);
            talkEndPromise.then(() => {
                app.stage.removeChild(talkBox);
                if (player) {
                    this.control(player, this.controlMode);
                }
                resolve();
            });
        });
    }
    moveCharacter(target, [destX, destY], speed, chaseCamera) {
        return new Promise((resolve) => {
            if (target.isDoing()) {
                resolve();
                return;
            }
            const { ticker } = this.getApplication();
            const tick = () => {
                const [curX, curY] = target.getPos();
                const diffX = destX - curX;
                const diffY = destY - curY;
                const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
                let arrived = distance < speed;
                if (arrived) {
                    target.setPos([destX, destY]);
                    target.stop();
                }
                else {
                    const deltaX = speed * (diffX / distance);
                    const deltaY = speed * (diffY / distance);
                    const nextX = this.getObjectNextX(target, deltaX);
                    const nextY = this.getObjectNextY(target, deltaY);
                    target.setPos([nextX, nextY]);
                    target.setDirection(getDirection(deltaX, deltaY));
                    target.play(speed);
                    if (curX === nextX && curY === nextY) {
                        arrived = true;
                    }
                }
                if (chaseCamera) {
                    const [cameraX, cameraY] = this.getCameraPos(target);
                    this.container.x = cameraX;
                    this.container.y = cameraY;
                }
                if (arrived) {
                    ticker.remove(tick);
                    target.stop();
                    resolve();
                }
            };
            target.play(speed);
            ticker.add(tick);
        });
    }
}
exports.default = SceneController;
