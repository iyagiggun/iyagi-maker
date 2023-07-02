import IObject from '../IObject';
import { Coords, isIntersecting } from '../Utils/Coordinate';
import SceneBase from './SceneBase';

export type EventType = 'start';

class SceneObjectManager extends SceneBase {
  protected objectList: IObject[];

  constructor(name: string, objectList: IObject[]) {
    super(name);
    this.objectList = [...objectList];
  }

  public load() {
    return Promise.all(this.objectList.map((obj) => obj.load()));
  }

  public draw() {
    const drawnList = this.container.children;
    this.objectList
      .filter((obj) => !drawnList.includes(obj))
      .forEach((obj) => {
        console.error('draw', obj.name, obj.getPos());
        this.container.addChild(obj);
        console.error('draw', obj.name, obj.getPos());
      });
  }

  public addObject(obj: IObject) {
    if (!obj.isLoaded()) {
      throw new Error(`Fail to add object. ${obj.name} is not loaded.`);
    }
    if (this.objectList.includes(obj)) {
      throw new Error(`Fail to add object. ${obj.name} is already in ${this.name}`);
    }
    this.objectList.push(obj);
  }

  public removeObject(obj: IObject) {
    if (!this.objectList.includes(obj)) {
      throw new Error(`Fail to add object. ${obj.name} is not in ${this.name}`);
    }
    this.objectList = this.objectList.filter((_obj) => _obj !== obj);
  }

  protected getObjectNextX(target: IObject, dist: number) {
    const [curX, curY] = target.getPos();
    const width = target.getWidth();
    const height = target.getHeight();
    const nextX = curX + dist;
    const blockingObj = this.objectList.find((obj) => {
      if (obj === target || obj.getZIndex() !== target.getZIndex()) {
        return false;
      }
      return isIntersecting(
        [nextX, curY, width, height],
        obj.getCollisionArea(),
      );
    });

    if (blockingObj) {
      const blockingObjX = blockingObj.getPos()[0];
      return curX < blockingObjX ? blockingObjX - width : blockingObjX + blockingObj.getWidth();
    }
    return nextX;
  }

  protected getObjectNextY(target: IObject, dist: number) {
    const [curX, curY] = target.getPos();
    const width = target.getWidth();
    const height = target.getHeight();
    const nextY = curY + dist;

    const blockingObj = this.objectList
      .find((obj) => {
        if (obj === target || obj.getZIndex() !== target.getZIndex()) {
          return false;
        }
        return isIntersecting([curX, nextY, width, height], obj.getCollisionArea());
      });

    if (blockingObj) {
      const blockingObjY = blockingObj.getPos()[1];
      return curY < blockingObjY ? blockingObjY - height : blockingObjY + blockingObj.getHeight();
    }
    return nextY;
  }

  public getIntersectingObjectList(coords: Coords) {
    return this.objectList.filter((obj) => isIntersecting(coords, obj.getCollisionArea()));
  }
}

export default SceneObjectManager;
