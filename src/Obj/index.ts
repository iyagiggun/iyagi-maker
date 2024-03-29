import {
  AnimatedSprite,
  Container,
} from 'pixi.js';

import { FRAMES_PER_SECOND } from '../Constant';
import { Coords } from '../Utils/Coordinate';
import ISprite from './ISprite';
import { Direction } from './type';

export type IPos = [x: number, y: number];

export type ISpriteMap = {
  default: ISprite;
  [key:string]: ISprite;
};

/**
 * 높이를 나타내는 zIndex 는 y 값에 따라 보정이 필요하므로 해당 값만큼의 y값에 따른 보정이 가능하도록 함.
 * 따라서, 맵의 크기가 Z_INDEX_MOD 값보다 크면 문제가 될 수 있음
 */
const Z_INDEX_MOD = 10000;
export const DEFAULT_ANIMATION_SPEED = 6 / FRAMES_PER_SECOND; // 10 fps

export default class Obj extends EventTarget {
  protected container: Container;

  protected loaded = false;

  protected iSprite: ISprite;

  private dir: Direction = 'down';

  private zIndex = 1;

  public reaction?: () => Promise<void>;

  constructor(protected name: string, protected iSpriteMap: ISpriteMap) {
    super();
    this.container = new Container();
    this.iSprite = this.iSpriteMap.default;
  }

  public getName() {
    return this.name;
  }

  public getContainer() {
    return this.container;
  }

  public async load() {
    await Promise.all(Object.values(this.iSpriteMap).map((iSprite) => iSprite.load()));
    this.container.addChild(this.getSprite());
    this.loaded = true;
  }

  public isLoaded() {
    return this.loaded;
  }

  public getSprite() {
    const sprite = this.iSprite.getSprite(this.dir);
    if (!sprite) {
      throw new Error('[IObject.getSprite] no iSprite');
    }
    return sprite;
  }

  public getCollisionMod() {
    const collisionMod = this.iSprite.getCollisionMod(this.dir);
    if (!collisionMod) {
      throw new Error('[IObject.getSprite] no collision mod');
    }
    return collisionMod;
  }

  public getCollisionArea() {
    const [x, y] = this.getPos();
    const [, , colsW, colsH] = this.getCollisionMod();
    return [x, y, colsW, colsH] as Coords;
  }

  public getWidth() {
    return this.getCollisionMod()[2];
  }

  public getHeight() {
    return this.getCollisionMod()[3];
  }

  public getZIndex() {
    return this.zIndex;
  }

  public setZIndex(zIndex: number) {
    this.zIndex = zIndex;
    const [, y] = this.getPos();
    this.container.zIndex = this.zIndex * Z_INDEX_MOD + y;
    return this;
  }

  public getPos(): IPos {
    const [modX, modY] = this.getCollisionMod();
    return [this.container.x + modX, this.container.y + modY];
  }

  public setPos([x, y]: IPos) {
    const [modX, modY] = this.getCollisionMod();
    this.container.x = x - modX;
    this.container.y = y - modY;
    this.setZIndex(this.zIndex);
    return this;
  }

  public getDirection() {
    return this.dir;
  }

  public setDirection(nextDir: Direction) {
    const lastDir = this.dir;
    if (lastDir === nextDir) {
      return this;
    }
    if (!this.isLoaded()) {
      this.dir = nextDir;
      return this;
    }
    const curSprite = this.getSprite();
    this.dir = nextDir;
    const nextSprite = this.getSprite();
    if (curSprite instanceof AnimatedSprite) {
      this.stop();
    }
    this.container.removeChild(curSprite);
    this.container.addChild(nextSprite);
    return this;
  }

  /**
   * loop animation
   * @param speed
   * @returns
   */
  public play(speed = 1) {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      throw new Error('[IObject.play] Not an animation.');
    }
    if (sprite.playing) {
      return this;
    }
    sprite.loop = true;
    sprite.play();
    sprite.animationSpeed = speed * DEFAULT_ANIMATION_SPEED;
    return this;
  }

  public stop() {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      return this;
    }
    if (!sprite.playing) {
      return this;
    }
    sprite.stop();
    return this;
  }

  public getCenterPos() {
    const [x, y] = this.getPos();
    return [x + this.getWidth() / 2, y + this.getHeight() / 2];
  }

  public change(spriteKey: string) {
    const nextSprite = this.iSpriteMap[spriteKey];
    if (!nextSprite) {
      throw new Error('[IObject.change] No the sprite.');
    }
    this.container.removeChild(this.getSprite());
    this.stop();

    this.iSprite = nextSprite;
    this.container.addChild(this.iSprite.getSprite(this.dir));
    const lastSprite = this.getSprite();
    if (lastSprite instanceof AnimatedSprite) {
      this.stop();
    }
  }
}
