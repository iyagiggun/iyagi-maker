import Obj from '../Obj';
import { Coords, isIntersecting } from '../Utils/Coordinate';
import SceneBase from './SceneBase';

export type EventType = 'start';

class SceneObjectManager extends SceneBase {
  protected objectList: Obj[] = [];

  public load() {
    return Promise.all(this.objectList.map((obj) => obj.load()));
  }

  public draw() {
    this.objectList
      .forEach((obj) => {
        this.container.addChild(obj.getContainer());
      });
  }

  public addObject(obj: Obj) {
    if (this.objectList.includes(obj)) {
      throw new Error(`Fail to add object. ${obj.getName()} is already in ${this.name}`);
    }
    this.objectList.push(obj);
    this.container.addChild(obj.getContainer());
    return this;
  }

  public addObjectList(objList: Obj[]) {
    objList.forEach((obj) => this.addObject(obj));
    return this;
  }

  public removeObject(obj: Obj) {
    if (!this.objectList.includes(obj)) {
      throw new Error(`Fail to add object. ${obj.getName()} is not in ${this.name}`);
    }
    this.objectList = this.objectList.filter((_obj) => _obj !== obj);
    this.container.removeChild(obj.getContainer());
  }

  protected getObjectNextX(target: Obj, dist: number) {
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

  protected getObjectNextY(target: Obj, dist: number) {
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
