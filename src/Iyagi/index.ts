import { Application } from 'pixi.js';
import IScene from '../Scene';

class Iyagi {
  private currentScene?: IScene;

  constructor(private app: Application) {
  }

  public async play(scene: IScene) {
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

export default Iyagi;
