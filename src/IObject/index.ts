import {
  AnimatedSprite,
  Container,
} from 'pixi.js';

import { FRAMES_PER_SECOND } from '../Constant';
import { Direction, Pos } from './type';
import { Coords } from '../Utils/Coordinate';
import ISprite from './ISprite';

type AreaInfo = {
  coordsList: Coords[];
  collisionMod?: Coords;
};

type SpriteInfo = {
  up?: AreaInfo;
  down: AreaInfo;
  left?: AreaInfo;
  right?: AreaInfo;
  loop?: boolean;
};

export type IObjectProps = {
  name: string;
  spriteImgUrl: string;
  spriteInfoMap: {
    default: SpriteInfo;
    [key: string]: SpriteInfo;
  };
  pos?: Pos;
  dir?: Direction;
  zIndex?: number;
};

/**
 * 높이를 나타내는 zIndex 는 y 값에 따라 보정이 필요하므로 해당 값만큼의 y값에 따른 보정이 가능하도록 함.
 * 따라서, 맵의 크기가 Z_INDEX_MOD 값보다 크면 문제가 될 수 있음
 */
export const Z_INDEX_MOD = 10000;
const DEFAULT_ANIMATION_SPEED = 6 / FRAMES_PER_SECOND; // 10 fps

export default class IObject extends Container {
  private curISpriteKey?: string;

  private iSpriteMap: {
    [key: string]: ISprite;
  };

  private dir: Direction;

  public reaction?: () => Promise<void>;

  constructor(private props: IObjectProps) {
    super();
    this.name = props.name;

    this.iSpriteMap = Object.keys(this.props.spriteInfoMap).reduce<{ [key: string]: ISprite }>((acc, key) => ({
      ...acc,
      [key]: new ISprite({
        name: `${this.name}:${key}`,
        imgUrl: this.props.spriteImgUrl,
        ...this.props.spriteInfoMap[key],
      }),
    }), {});

    this.dir = this.props.dir || 'down';
    this.setZIndex(this.props.zIndex ?? 1);
  }

  public async load() {
    if (this.curISpriteKey) {
      return;
    }
    await Promise.all(Object.values(this.iSpriteMap).map((iSprite) => iSprite.load()));

    this.curISpriteKey = 'default';

    this.addChild(this.getSprite());

    if (this.props.pos) {
      this.setPos(this.props.pos);
    }
  }

  public isLoaded() {
    return !!this.curISpriteKey;
  }

  protected getCurISpriteKey() {
    if (!this.curISpriteKey) {
      throw new Error(`[IObject.getCurISpriteKey] Not loaded. "${this.name}"`);
    }
    return this.curISpriteKey;
  }

  private getISprite() {
    if (!this.curISpriteKey) {
      throw new Error(`[IObject.getISprite] Not loaded. "${this.name}"`);
    }
    const iSprite = this.iSpriteMap[this.curISpriteKey];
    return iSprite;
  }

  protected getSprite() {
    return this.getISprite().getSprite(this.dir);
  }

  public getCollisionMod() {
    if (!this.curISpriteKey) {
      throw new Error(`[IObject.getCollisionMod] Not loaded. "${this.name}"`);
    }
    return this.getISprite().getCollisionMod(this.dir);
  }

  public getCollisionArea(): Coords {
    const [x, y] = this.getPos();
    const [, , colsW, colsH] = this.getCollisionMod();
    return [x, y, colsW, colsH];
  }

  public getWidth() {
    return this.getCollisionMod()[2];
  }

  public getHeight() {
    return this.getCollisionMod()[3];
  }

  public getZIndex() {
    return Math.floor(this.zIndex / Z_INDEX_MOD);
  }

  public setZIndex(_zIndex?: number) {
    const zIndex = _zIndex ?? Math.floor(this.zIndex / Z_INDEX_MOD);
    this.zIndex = zIndex * Z_INDEX_MOD + this.y + this.height;
    return this;
  }

  public getPos(): Pos {
    const [modX, modY] = this.getCollisionMod();
    return [this.x + modX, this.y + modY];
  }

  public setPos([x, y]: Pos) {
    const [modX, modY] = this.getCollisionMod();
    this.x = x - modX;
    this.y = y - modY;
    this.setZIndex();
    return this;
  }

  public getDirection() {
    return this.dir;
  }

  public setDirection(nextDir: Direction) {
    const lastDir = this.dir;
    const curSprite = this.getSprite();
    if (lastDir === nextDir) {
      return this;
    }
    try {
      const nextSprite = this.getISprite().getSprite(nextDir);
      if (curSprite instanceof AnimatedSprite) {
        this.stop();
      }
      this.removeChild(curSprite);
      this.addChild(nextSprite);
      this.dir = nextDir;
    } catch (e) {
      this.dir = lastDir;
      throw e;
    }
    return this;
  }

  public play(acc = 1, playPosition?: number) {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      throw new Error(`[IObject.play] Not AnimatedSprite. "${this.name}". "${this.curISpriteKey}. "${this.dir}"`);
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
      throw new Error(`Fail to stop animation. "${this.name}" is not an animation.`);
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
    const iSprite = this.iSpriteMap[spriteKey];
    if (!iSprite) {
      throw new Error(`[IObject.change] No the sprite. "${this.name}". ${spriteKey}.`);
    }
    const lastSprite = this.getSprite();
    if (lastSprite instanceof AnimatedSprite) {
      this.stop();
    }
    this.curISpriteKey = spriteKey;
    this.removeChild(lastSprite);
    this.addChild(this.getSprite());
  }
}
