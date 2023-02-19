import { Application } from 'pixi.js';
import IScene from '../Scene';

class Iyagi {

  private app: Application;

  constructor(canvas: HTMLCanvasElement) {
    this.app = new Application({
      view: canvas,
      backgroundColor: 0x000000,
      width: canvas.width,
      height: canvas.height
    });
  }

  play(scene: IScene) {
    this.app.stage.removeChildren();
    this.app.stage.addChild(scene);
    scene.drawMap();
    console.error(scene);
  }
}

export default Iyagi;