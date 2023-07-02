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
const DEFAULT_ANIMATION_SPEED = 6 / FRAMES_PER_SECOND; // 10 fps

export default class IObject extends Container {
  protected loaded = false;

  private iSprite: ISprite;

  private dir: Direction = 'down';

  private iZIndex = 1;

  public reaction?: () => Promise<void>;

  constructor(name: string, private iSpriteMap: ISpriteMap) {
    super();
    this.name = name;
    this.iSprite = this.iSpriteMap.default;
  }

  public async load() {
    await Promise.all(Object.values(this.iSpriteMap).map((iSprite) => iSprite.load()));
    this.addChild(this.getSprite());
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
    return this.iZIndex;
  }

  public setZIndex(zIndex: number) {
    this.zIndex = zIndex * Z_INDEX_MOD + this.y + this.height;
  }

  public getPos(): IPos {
    const [modX, modY] = this.getCollisionMod();
    return [this.x + modX, this.y + modY];
  }

  public setPos([x, y]: IPos) {
    const [modX, modY] = this.getCollisionMod();
    this.x = x - modX;
    this.y = y - modY;
    this.setZIndex(this.iZIndex);
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
      return this;
    }
    const curSprite = this.getSprite();
    this.dir = nextDir;
    const nextSprite = this.getSprite();
    if (curSprite instanceof AnimatedSprite) {
      this.stop();
    }
    this.removeChild(curSprite);
    this.addChild(nextSprite);
    return this;
  }

  public play(acc = 1, playPosition?: number) {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      throw new Error('[IObject.play] Not an animation.');
    }
    if (!sprite.playing) {
      if (playPosition === undefined) {
        sprite.play();
      } else {
        sprite.gotoAndPlay(playPosition);
      }
    }
    sprite.animationSpeed = acc * DEFAULT_ANIMATION_SPEED;
    return this;
  }

  public stop() {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      throw new Error('[IObject.stop] Not an animation.');
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
    try {
      this.removeChild(this.getSprite());
      this.stop();
    } catch (e) {
      if (!`${e}`.includes('[Object.')) {
        throw e;
      }
    }
    this.iSprite = nextSprite;
    this.addChild(this.iSprite.getSprite(this.dir));
    const lastSprite = this.getSprite();
    if (lastSprite instanceof AnimatedSprite) {
      this.stop();
    }
  }

  // public emit(event: string) {
  //   console.error(this, event);
  //   this.emit('fuck');
  // }
}
