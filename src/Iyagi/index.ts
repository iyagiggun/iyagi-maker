import { Application } from 'pixi.js';
import IScene from '../Scene';

class Iyagi {
  private app: Application;

  private currentScene?: IScene;

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

  async play(scene: IScene) {
    await scene.load();
    if (this.currentScene) {
      this.currentScene.detach();
    }
    scene.attachAt(this.app);
    scene.drawMap();
    scene.dispatchEvent(new CustomEvent('start'));
  }
}

export default Iyagi;
