import throttle from 'lodash-es/throttle';
import { Application, Container, Sprite } from 'pixi.js';
import { IObject } from '..';
import { TRANSPARENT_1PX_IMG } from '../Constant';
import ITile, { TILE_SIZE } from '../Object/Tile';

const getAcc = (distance: number): 0 | 1 | 2 | 3 => {
  if (distance < 24) {
    return 0;
  }
  if (distance < 48) {
    return 1;
  }
  if (distance < 72) {
    return 2;
  }
  return 3;
};

export default class IScene extends Container {

  private app?: Application;
  private controller?: Sprite;

  constructor(name: string, private tiles: ITile[][], private objectList: IObject[]) {
    super();
    this.name = name;
  }

  public setApplication(app: Application) {
    this.app = app;
  }

  private getApplication() {
    if (!this.app) {
      throw new Error(`[scene: ${this.name}] no application.`);
    }
    return this.app;
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

  private interact() {
    console.error('interact!!');
  }

  public controll(target: IObject) {
    if (!this.controller) {
      const { width: appWidth, height: appHeight } = this.getApplication().view;
      let joystickId: undefined | number = undefined;
      let [startX, startY] = [0, 0];
      let [deltaX, deltaY] = [0, 0];

      this.controller = Sprite.from(TRANSPARENT_1PX_IMG);
      this.controller.width = appWidth;
      this.controller.height = appHeight;
      this.controller.interactive = true;

      const ticker = this.getApplication().ticker;
      const tick = () => {
        const [curX, curY] = target.getPos();
        const nextX = this.getObjectNextX(target, deltaX);
        const nextY = this.getObjectNextY(target, deltaY);
        this.x += curX - nextX;
        this.y += curY - nextY;
        target.setPos(nextX, nextY);
      };

      this.controller.addEventListener('touchstart', (evt) => {
        const { x,y } = evt.global;
        if (joystickId === undefined && x < appWidth / 2) {
          startX = x;
          startY = y;
          joystickId = evt.pointerId;
          ticker.add(tick);
        } else {
          this.interact();
        }
      });

      this.controller.addEventListener('touchmove', throttle((evt) => {
        if (joystickId !== evt.pointerId) {
          return;
        }
        const {x, y} = evt.global;
        const diffX = x - startX;
        const diffY = y - startY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
        if (distance === 0) {
          return;
        }
        const acc = getAcc(distance);
        if (acc === 0) {
          deltaX = 0;
          deltaY = 0;
          target.stop();
          return;
        }
        deltaX = Math.round((diffX * acc) / distance);
        deltaY = Math.round((diffY * acc) / distance);
        target.changeDirectionWithDelta(deltaX, deltaY);
        target.play(acc);
      }, 50));

      this.controller.addEventListener('touchend', () => {
        joystickId = undefined;
        target.stop();
        ticker.remove(tick);
      });

      this.parent.addChild(this.controller);
    }
  }

  private getObjectNextX(obj: IObject, dist: number) {
    const [curX, curY] = obj.getPos();
    const width = obj.getWidth();
    const height = obj.getHeight();
    const nextX = curX + dist;

    // const blockingObj = this.#impassbleMap.concat(this.#collisionObjList)
    //   .find((target) => {
    //     if (target === obj) {
    //       return false;
    //     }
    //     const { x: targetX, y: targetY } = target.getPos();
    //     return isIntersecting(
    //       nextX, curY, width, height, targetX,
    //       targetY, target.getWidth(), target.getHeight(),
    //     );
    //   });

    // if (!blockingObj) {
    return nextX;
    // }
    // const blockingObjX = blockingObj.getPos().x;
    // return curX < blockingObjX ? blockingObjX - width : blockingObjX + blockingObj.getWidth();
  }

  private getObjectNextY(obj: IObject, dist: number) {
    const [curX, curY ] = obj.getPos();
    const width = obj.getWidth();
    const height = obj.getHeight();
    const nextY = curY + dist;

    // const blockingObj = this.#impassbleMap.concat(this.#collisionObjList)
    //   .find((target) => {
    //     if (target === obj) {
    //       return false;
    //     }
    //     const { x: targetX, y: targetY } = target.getPos();
    //     return isIntersecting(
    //       curX, nextY, width, height, targetX,
    //       targetY, target.getWidth(), target.getHeight(),
    //     );
    //   });

    // if (!blockingObj) {
    return nextY;
    // }
    // const blockingObjY = blockingObj.getPos().y;
    // return curY < blockingObjY ? blockingObjY - width : blockingObjY + blockingObj.getHeight();
  }

}
