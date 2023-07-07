"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async play(scene) {
        if (this._curScene) {
            this._app.stage.removeChild(this._curScene.getContainer());
            this._curScene.dispatchEvent(new CustomEvent('cut'));
        }
        this._curScene = scene;
        await this._curScene.load();
        this._app.stage.addChild(this._curScene.getContainer());
        this._curScene.draw();
        this._curScene.dispatchEvent(new CustomEvent('start'));
    },
};
// export default class Director {
//   private curScene?: Scene;
//   constructor(private app: Application) {
//   }
//   public async play(scene: Scene) {
//     if (this.curScene) {
//       this.app.stage.removeChild(this.curScene.getContainer());
//       this.curScene.dispatchEvent(new CustomEvent('cut'));
//     }
//     this.curScene = scene;
//     await scene.load();
//     this.app.stage.addChild(this.curScene.getContainer());
//     scene.draw();
//     scene.dispatchEvent(new CustomEvent('start'));
//   }
// }
