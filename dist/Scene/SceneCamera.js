"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SceneObjectManager_1 = __importDefault(require("./SceneObjectManager"));
class SceneCamera extends SceneObjectManager_1.default {
    getCameraPos(target) {
        if (!this.objectList.includes(target)) {
            throw new Error(`Fail to focus. ${target.getName()}. no the target in scene "${this.name}".`);
        }
        const [targetCenterX, targetCenterY] = target.getCenterPos();
        const { width: appWidth, height: appHeight } = this.app.view;
        const destX = Math.round((appWidth / 2) - targetCenterX);
        const destY = Math.round((appHeight / 2) - targetCenterY);
        return [destX, destY];
    }
    async moveCamera(target, speed = Infinity) {
        return new Promise((resolve) => {
            const [destX, destY] = this.getCameraPos(target);
            const cameraSpeed = speed * 2;
            const { ticker } = this.app;
            const tick = () => {
                const curX = this.container.x;
                const curY = this.container.y;
                const diffX = destX - curX;
                const diffY = destY - curY;
                const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
                const arrived = distance < cameraSpeed;
                if (arrived) {
                    this.container.x = destX;
                    this.container.y = destY;
                    ticker.remove(tick);
                    resolve();
                }
                else {
                    const deltaX = cameraSpeed * (diffX / distance);
                    const deltaY = cameraSpeed * (diffY / distance);
                    this.container.x += Math.round(deltaX);
                    this.container.y += Math.round(deltaY);
                }
            };
            ticker.add(tick);
        });
    }
}
exports.default = SceneCamera;
