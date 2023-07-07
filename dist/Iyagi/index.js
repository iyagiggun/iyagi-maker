"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Iyagi {
    constructor(app) {
        this.app = app;
    }
    async play(scene) {
        await scene.load();
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene.getContainer());
            this.currentScene.dispatchEvent(new CustomEvent('cut'));
        }
        this.currentScene = scene;
        this.app.stage.addChild(this.currentScene.getContainer());
        this.currentScene.draw();
        this.currentScene.dispatchEvent(new CustomEvent('start'));
    }
}
exports.default = Iyagi;
