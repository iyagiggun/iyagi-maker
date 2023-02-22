import { Container } from 'pixi.js';
import { IObject } from '..';
import ITile, { TILE_SIZE } from '../Object/Tile';

export default class IScene extends Container {

  constructor(private tiles: ITile[][], private objectList: IObject[]) {
    super();
  }

  private load() {
    return Promise.all([
      ...this.tiles.reduce((acc, item) => acc.concat(item)).map(tile => tile.load()),
      ...this.objectList.map((obj) => obj.load())]);
  }

  public drawMap(){
    this.load().then(() => {
      this.tiles.forEach((row, rowIdx) => row.forEach((tile, colIdx) => {
        const sprite = tile.getSprite();
        sprite.x = colIdx * TILE_SIZE;
        sprite.y = rowIdx * TILE_SIZE;
        this.addChild(sprite);
      }));
      this.objectList.forEach((obj) => {
        this.addChild(obj.getSprite());
      });
    });
  }
}
