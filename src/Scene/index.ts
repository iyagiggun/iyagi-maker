import { Container, Sprite } from 'pixi.js';
import { IObject } from '..';
import ITile, { TILE_SIZE } from '../Object/Tile';
import { TRANSPARENT } from '../Utils/Image';

export default class IScene extends Container {

  private controllTarget?: IObject;
  private controller?: Sprite;

  constructor(private tiles: ITile[][], private objectList: IObject[]) {
    super();
  }

  public load() {
    return Promise.all([
      ...this.tiles.reduce((acc, item) => acc.concat(item)).map(tile => tile.load()),
      ...this.objectList.map((obj) => obj.load())]);
  }

  public drawMap(){
    this.tiles.forEach((row, rowIdx) => row.forEach((tile, colIdx) => {
      const sprite = tile.getSprite();
      sprite.x = colIdx * TILE_SIZE;
      sprite.y = rowIdx * TILE_SIZE;
      this.addChild(sprite);
    }));
    this.objectList.forEach((obj) => {
      this.addChild(obj.getSprite());
    });
  }

  public controll(target: IObject) {
    this.controllTarget = target;
    if (!this.controller) {
      this.controller = Sprite.from(TRANSPARENT);
      this.controller.width = this.parent.width;
      this.controller.height = this.parent.height;
      this.controller.interactive = true;

      this.controller.addEventListener('touchstart', () => {
        console.error('start');
      });
      this.controller.addEventListener('touchmove', () => {
        console.error(333);
      });

      this.parent.addChild(this.controller);
    }
  }

}
