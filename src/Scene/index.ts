import throttle from 'lodash-es/throttle';
import { Application, Container, Sprite } from 'pixi.js';
import { IObject } from '..';
import { TRANSPARENT_1PX_IMG } from '../Constant';
import ITile, { TILE_SIZE } from '../Object/Tile';
import { getAcc, isIntersecting } from './Calc';
import ISceneEvent, { ISceneEventType } from './Event';
import { getTalkBox } from './TalkBox';

const DEFAULT_MARGIN = 30;
const REACTION_OVERLAP_THRESHOLD = 10;

type SceneInfo = {
  margin: number;
}

type Status = 'idle' |'talking';

export default class IScene extends EventTarget {
  private status: Status = 'idle';
  private container: Container;
  private width: number;
  private height: number;
  private app?: Application;
  private margin: number;
  private player?: IObject;
  private controller?: Sprite;
  private blockingObjectList: IObject[];

  constructor(private name: string, private tiles: ITile[][], private objectList: IObject[], info?: SceneInfo) {
    super();
    this.container = new Container();
    this.container.sortableChildren = true;
    this.width = 0;
    this.height = 0;
    this.blockingObjectList = tiles.reduce((acc, items) => acc.concat(items)).concat(objectList).filter((obj) => !obj.isPassable());
    this.margin = info?.margin ?? DEFAULT_MARGIN;
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
    this.app.stage.addChild(this.container);
  }

  public load() {
    return Promise.all([
      ...this.tiles.reduce((acc, item) => acc.concat(item)).map(tile => tile.load()),
      ...this.objectList.map((obj) => obj.load())]);
  }

  public drawMap(){
    this.tiles.forEach((row, rowIdx) => row.forEach((tile, colIdx) => {
      tile.setPos(colIdx * TILE_SIZE, rowIdx * TILE_SIZE, -TILE_SIZE);
      tile.attachAt(this.container);
    }));
    this.width = this.container.width;
    this.height = this.container.height;
    this.objectList.forEach((obj) => {
      obj.attachAt(this.container);
    });
  }

  public focus(target: IObject) {
    const [targetX, targetY] = target.getPos();
    const { width: appWidth, height: appHeight } = this.getApplication().view;
    const minX = appWidth - this.width - this.margin;
    const minY = appHeight - this.height - this.margin;
    const destX = Math.round((appWidth / 2) - targetX - (target.getWidth() / 2));
    const destY = Math.round((appHeight / 2) - targetY - (target.getHeight() / 2));
    this.container.x = Math.max(Math.min(destX, this.margin), minX);
    this.container.y = Math.max(Math.min(destY, this.margin), minY);
  }

  public control(player: IObject) {
    if (this.status !== 'idle') {
      throw new Error(`[scene: ${this.name}] is busy. status = ${this.status}`);
    }
    if (!this.controller) {
      const { width: appWidth, height: appHeight } = this.getApplication().view;
      let joystickId: undefined | number = undefined;
      let [startX, startY] = [0, 0];
      let [deltaX, deltaY] = [0, 0];

      const controller = Sprite.from(TRANSPARENT_1PX_IMG);
      this.controller = controller;
      this.controller.width = appWidth;
      this.controller.height = appHeight;

      const ticker = this.getApplication().ticker;
      const tick = () => {
        const nextX = this.getObjectNextX(player, deltaX);
        const nextY = this.getObjectNextY(player, deltaY);
        player.setPos(nextX, nextY);
        this.focus(player);
      };

      this.controller.addEventListener('touchstart', (evt) => {
        const { x, y } = evt.global;
        if (joystickId === undefined && x < appWidth / 2) {
          // case:: joystick on
          startX = x;
          startY = y;
          joystickId = evt.pointerId;
          ticker.add(tick);
        } else {
          // case:: interact
          const interaction = this.getInteraction();
          if (!interaction) {
            return;
          }
          controller.interactive = false;
          joystickId = undefined;
          player.stop();
          ticker.remove(tick);
          interaction().then(() => {
            controller.interactive = true;
          });
        }
      });

      this.controller.addEventListener('touchmove', throttle((evt) => {
        if (joystickId !== evt.pointerId) {
          return;
        }
        const { x, y } = evt.global;
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
          player.stop();
          return;
        }
        deltaX = Math.round((diffX * acc) / distance);
        deltaY = Math.round((diffY * acc) / distance);
        player.changeDirection(deltaX, deltaY);
        player.play(acc);
      }, 50));

      this.controller.addEventListener('touchend', (evt) => {
        if (joystickId !== evt.pointerId) {
          return;
        }
        joystickId = undefined;
        player.stop();
        ticker.remove(tick);
      });

      this.container.parent.addChild(this.controller);
      this.focus(player);
    }
    this.controller.interactive = true;
    this.player = player;
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
    const [curX, curY] = target.getPos();
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
        const [objX, objY] = obj.getPos();
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

  private getInteraction() {
    const player = this.player;
    if (!player) {
      throw new Error(`[scene: ${this.name}] no player`);
    }
    const playerDirection = player.getDirection();

    const [px, py] = player.getPos();
    const pWidth = player.getWidth();
    const cHeight = player.getHeight();
    const cCenterX = px + pWidth / 2;
    const cCenterY = py + cHeight / 2;
    const target = this.objectList.find((obj) => {
      const [oX, oY] = obj.getPos();
      switch (playerDirection) {
      case 'down':
        return (
          Math.abs(cCenterX - (oX + obj.getWidth() / 2))
                      < REACTION_OVERLAP_THRESHOLD && Math.abs(py + cHeight - oY) < 2
        );
      case 'up':
        return (
          Math.abs(cCenterX - (oX + obj.getWidth() / 2))
                      < REACTION_OVERLAP_THRESHOLD && Math.abs(oY + obj.getHeight() - py) < 2
        );
      case 'left':
        return (
          Math.abs(cCenterY - (oY + obj.getHeight() / 2))
                      < REACTION_OVERLAP_THRESHOLD && Math.abs(oX + obj.getWidth() - px) < 2
        );
      case 'right':
        return (
          Math.abs(cCenterY - (oY + obj.getHeight() / 2))
                      < REACTION_OVERLAP_THRESHOLD && Math.abs(px + pWidth - oX) < 2
        );
      default:
        return false;
      }
    });
    if (!target) {
      return null;
    }
    return target.getReaction();
  }

  public talk(speaker: IObject, message: string) {
    this.status = 'talking';
    const player = this.player;
    return new Promise<void>((resolve) => {
      const app = this.getApplication();
      const talkBox = getTalkBox(speaker, message, app.view);

      const lastContainerX = this.container.x;
      const minusX = talkBox.width / 2;
      const speakerGlobalX = speaker.getGlobalPos()[0];
      if (app.view.width - speakerGlobalX < minusX) {
        this.container.x = lastContainerX - talkBox.width;
      } else if (speakerGlobalX + speaker.getWidth() > minusX) {
        this.container.x = lastContainerX - minusX;
      }
      talkBox.interactive = true;
      talkBox.addEventListener('touchstart', () => {
        app.stage.removeChild(talkBox);
        this.container.x = lastContainerX;
        this.status = 'idle';
        if (player) {
          this.control(player);
        }
        resolve();
      });
      app.stage.addChild(talkBox);
    });
  }

}
