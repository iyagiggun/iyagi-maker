import IObject from '../Object';
import { Coords, isIntersecting } from '../Utils/Coordinate';
import SceneBase from './SceneBase';

export type EventType = 'start';

class SceneObjectManager extends SceneBase {
  protected objectList: IObject[];

  protected blockingObjectList: IObject[];

  constructor(name: string, objectList: IObject[]) {
    super(name);
    this.objectList = objectList;
    this.blockingObjectList = objectList.filter((obj) => !obj.isPassable());
  }

  public load() {
    return Promise.all(this.objectList.map((obj) => obj.load()));
  }

  public addObject(obj: IObject) {
    if (!obj.isLoaded()) {
      throw new Error(`Fail to add object. ${obj.getName()} is not loaded.`);
    }
    if (this.objectList.includes(obj)) {
      throw new Error(`Fail to add object. ${obj.getName()} is already in ${this.name}`);
    }
    this.objectList.push(obj);
    if (!obj.isPassable()) {
      this.blockingObjectList.push(obj);
    }
    obj.attach(this.container);
  }

  public removeObject(obj: IObject) {
    if (!this.objectList.includes(obj)) {
      throw new Error(`Fail to add object. ${obj.getName()} is not in ${this.name}`);
    }
    this.objectList = this.objectList.filter((_obj) => _obj !== obj);
    this.blockingObjectList = this.blockingObjectList.filter((_obj) => _obj !== obj);
    obj.detach(this.container);
  }

  protected getObjectNextX(target: IObject, dist: number) {
    const [curX, curY] = target.getPos();
    const width = target.getWidth();
    const height = target.getHeight();
    const nextX = curX + dist;
    const blockingObj = this.blockingObjectList.find((obj) => {
      if (obj === target) {
        return false;
      }
      return isIntersecting(
        [nextX, curY, width, height],
        obj.getCollisionCoords(),
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

    const blockingObj = this.blockingObjectList
      .find((obj) => {
        if (obj === target) {
          return false;
        }
        return isIntersecting([curX, nextY, width, height], obj.getCollisionCoords());
      });

    if (blockingObj) {
      const blockingObjY = blockingObj.getPos()[1];
      return curY < blockingObjY ? blockingObjY - height : blockingObjY + blockingObj.getHeight();
    }
    return nextY;
  }

  public getIntersectingObjectList(coords: Coords) {
    return this.objectList.filter((obj) => isIntersecting(coords, obj.getCollisionCoords()));
  }
}

export default SceneObjectManager;
