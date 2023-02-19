import { Container } from 'pixi.js';
import ITile from '../Object/Tile';

export default class IScene extends Container {

  constructor(private tiles: ITile[][]) {
    super();
    console.error('igscene created');
  }

  public hello() {
    console.error('hello igscene ' );
  }

  private load() {
    return Promise.all([...this.tiles.reduce((acc, item) => acc.concat(item)).map(tile => tile.load())]);
  }

  drawMap(){
    this.load().then(() => {
      this.tiles.forEach((row, rowIdx) => row.forEach((tile, colIdx) => {
        this.addChild(tile.getSprite());
        tile.getSprite().x = colIdx * 100;
      }));
    });
  }
}
