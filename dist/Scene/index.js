"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SceneController_1 = __importDefault(require("./SceneController"));
class Scene extends SceneController_1.default {
    constructor() {
        super(...arguments);
        this.status = 'idle';
    }
    drawMap() {
        // add object
        this.objectList.forEach((obj) => {
            obj.attach(this.container);
        });
    }
    moveCharacter(target, [destX, destY], speed, chaseCamera) {
        return new Promise((resolve) => {
            const { ticker } = this.getApplication();
            const tick = () => {
                const [curX, curY] = target.getPos();
                const diffX = destX - curX;
                const diffY = destY - curY;
                const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
                let arrived = distance < speed;
                if (arrived) {
                    target.setPos(destX, destY);
                    target.stop();
                }
                else {
                    const deltaX = speed * (diffX / distance);
                    const deltaY = speed * (diffY / distance);
                    const nextX = this.getObjectNextX(target, deltaX);
                    const nextY = this.getObjectNextY(target, deltaY);
                    target.setPos(nextX, nextY);
                    target.changeDirection(deltaX, deltaY);
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
exports.default = Scene;
