import { Application } from 'pixi.js';
import IScene from '../Scene';

class Iyagi {
  private app: Application;

  private width: number;

  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.width = parseInt(getComputedStyle(canvas).width, 10);
    this.height = parseInt(getComputedStyle(canvas).height, 10);
    this.app = new Application({
      view: canvas,
      backgroundColor: 0x000000,
      width: this.width,
      height: this.height,
    });
  }

  play(scene: IScene) {
    this.app.stage.removeChildren();
    scene.load().then(() => {
      scene.setApplication(this.app);
      scene.drawMap();
      scene.dispatchEvent(new CustomEvent('start'));
    });
  }
}

export default Iyagi;
