import throttle from 'lodash-es/throttle';
import { Application, Container, Sprite } from 'pixi.js';
import { IObject } from '..';
import { TRANSPARENT_1PX_IMG } from '../Constant';
import ITile, { TILE_SIZE } from '../Object/Tile';
import ISceneEvent, { ISceneEventType } from './Event';

/**
 * 반드시 a1 <= a2 이고, b1 <=  b2 여야함. (이게 맞지 않으면 제대로 체크되지 않음)
 * @return {boolean} 1차원 공간에서 직선 2개가 겹치는지 여부
 */
const isOverlapIn1D = (
  a1: number,
  a2: number,
  b1: number,
  b2: number,
): boolean => {
  if (a2 <= b1 || a1 >= b2) {
    return false;
  }
  return true;
};

const isIntersecting = (
  x1: number,
  y1: number,
  width1: number,
  height1: number,
  x2: number,
  y2: number,
  width2: number,
  height2: number,
) => isOverlapIn1D(
  x1,
  x1 + width1,
  x2,
  x2 + width2,
) && isOverlapIn1D(
  y1,
  y1 + height1,
  y2,
  y2 + height2,
);

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

export default class IScene extends EventTarget {

  private container: Container;
  private width: number;
  private height: number;
  private app?: Application;
  private controller?: Sprite;
  private blockingObjectList: IObject[];

  constructor(private name: string, private tiles: ITile[][], private objectList: IObject[]) {
    super();
    this.container = new Container();
    this.width = 0;
    this.height = 0;
    this.blockingObjectList = tiles.reduce((acc, items) => acc.concat(items)).concat(objectList).filter((obj) => !obj.isPassable());
  }

  public getContainer() {
    return this.container;
  }

  public addEventListener(type: ISceneEventType, callback: () => void) {
    super.addEventListener(type, callback);
  }

  public dispatchEvent(event: ISceneEvent) {
    super.dispatchEvent(event);
    return true;
  }

  private getApplication() {
    if (!this.app) {
      throw new Error(`[scene: ${this.name}] no application.`);
    }
    return this.app;
  }

  public setApplication(app: Application) {
    this.app = app;
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
      this.container.addChild(sprite);
    }));
    this.width = this.container.width;
    this.height = this.container.height;
    this.objectList.forEach((obj) => {
      this.container.addChild(obj.getSprite());
    });
  }

  private getFocusPos(target: IObject) {
    const [targetX, targetY] = target.getPos();
    const { width: appWidth, height: appHeight } = this.getApplication().view;
    const minX = this.getApplication().view.width - this.width;
    const minY = this.getApplication().view.height- this.height;
    const destX = Math.round((appWidth / 2) - targetX - (target.getWidth() / 2));
    const destY = Math.round((appHeight / 2) - targetY - (target.getHeight() / 2));
    return [Math.max(Math.min(destX, 0), minX), Math.max(Math.min(destY, 0), minY)];
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
        const nextX = this.getObjectNextX(target, deltaX);
        const nextY = this.getObjectNextY(target, deltaY);
        target.setPos(nextX, nextY);
        const [x, y] = this.getFocusPos(target);
        this.container.x = x;
        this.container.y = y;
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

      this.container.parent.addChild(this.controller);
      const [x, y] = this.getFocusPos(target);
      this.container.x = x;
      this.container.y = y;
    }
  }

  private getObjectNextX(target: IObject, dist: number) {
    const [curX, curY] = target.getPos();
    const width = target.getWidth();
    const height = target.getHeight();
    const nextX = curX + dist;
    // map out check
    if (nextX < 0 || nextX + width > this.width) {
      return curX;
    }
    const blockingObj = this.blockingObjectList.find((obj) => {
      if (obj === target) {
        return false;
      }
      const [objX, objY] = obj.getPos();
      return isIntersecting(nextX, curY, width, height,
        objX, objY, obj.getWidth(), obj.getHeight());
    });

    if (blockingObj) {
      const blockingObjX = blockingObj.getPos()[0];
      return curX < blockingObjX ? blockingObjX - width : blockingObjX + blockingObj.getWidth();
    }
    return nextX;
  }

  private getObjectNextY(target: IObject, dist: number) {
    const [curX, curY ] = target.getPos();
    const width = target.getWidth();
    const height = target.getHeight();
    const nextY = curY + dist;

    // map out check
    if (nextY < 0 || nextY + height > this.height) {
      return curY;
    }
    const blockingObj = this.blockingObjectList
      .find((obj) => {
        if (obj === target) {
          return false;
        }
        const [objX, objY]= obj.getPos();
        return isIntersecting(
          curX, nextY, width, height,
          objX, objY, obj.getWidth(), obj.getHeight(),
        );
      });

    if (blockingObj) {
      const blockingObjY = blockingObj.getPos()[1];
      return curY < blockingObjY ? blockingObjY - height : blockingObjY + blockingObj.getHeight();
    }
    return nextY;
  }

  private interact() {
    console.error('interact!!');
  }

}
