import { Application } from 'pixi.js';
import IScene from '../Scene';
import ISceneEvent from '../Scene/Event';

class Iyagi {

  private app: Application;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.width = parseInt(getComputedStyle(canvas).width);
    this.height = parseInt(getComputedStyle(canvas).height);
    this.app = new Application({
      view: canvas,
      backgroundColor: 0x000000,
      width: this.width,
      height: this.height
    });
  }

  play(scene: IScene) {
    this.app.stage.removeChildren();
    scene.load().then(() => {
      scene.setApplication(this.app);
      scene.drawMap();
      scene.dispatchEvent(new ISceneEvent('start'));
    });
  }
}

export default Iyagi;