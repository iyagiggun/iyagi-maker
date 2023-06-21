import { DisplayObject } from 'pixi.js';
import SceneController from './SceneController';

type Status = 'idle' | 'talking' | '';

export default class IScene extends SceneController {
  private status: Status = 'idle';

  public drawMap() {
    // add object
    this.objectList.forEach((obj) => {
      this.container.addChild(obj);
    });
  }

  public addChild(child: DisplayObject) {
    this.container.addChild(child);
  }
}
