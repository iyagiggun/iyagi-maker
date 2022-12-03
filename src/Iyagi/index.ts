import { Application } from 'pixi.js';

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
}

export default Iyagi;