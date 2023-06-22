import {
  Assets, Container, Sprite, Texture,
} from 'pixi.js';
import { IObjectInterface, Pos } from '.';
import IObject, { IObjectProps } from './IObject';
import { TRANSPARENT_1PX_IMG } from '../Constant';

type Direction = 'up' | 'down' | 'left' | 'right';

export type ICharacterProps = {
  name: string;
  spriteUrl: string;
  iObjectMap: {
    up?: SubIObjectProps,
    down: SubIObjectProps;
    left?: SubIObjectProps;
    right?: SubIObjectProps;
    [key: string]: SubIObjectProps | undefined;
  };
  pos?: Pos;
  zIndex?: number;
  direction?: Direction;
  photoMap?: {
    default: string;
    [key: string]: string;
  }
};

type SubIObjectProps = Omit<IObjectProps, 'name' | 'spriteUrl'>;

const DEFAULT_PHOTO_INFO = { default: TRANSPARENT_1PX_IMG };

export default class ICharacter<T = void> extends Container implements IObjectInterface {
  private status: T;

  private loaded = false;

  private current: IObject;

  public reaction?: () => Promise<void>;

  private iObjectMap: {
    [key: string]: IObject;
  } = {};

  private photo?: Sprite;

  private photoTextureMap?: { [key: string]: Texture };

  constructor(private props: ICharacterProps & {
    status: T
  }) {
    super();
    this.name = props.name;

    this.iObjectMap = Object.keys(this.props.iObjectMap).reduce<{ [key:string]: IObject }>((acc, key) => {
      const subIObjectProps = this.props.iObjectMap[key];
      if (subIObjectProps) {
        acc[key] = new IObject({
          name: `${this.name}:${key}`,
          spriteUrl: this.props.spriteUrl,
          ...subIObjectProps,
        });
      }
      return acc;
    }, {});
    this.status = props.status;
    const direction = props.direction || 'down';
    const current = this.iObjectMap[direction];
    if (!current) {
      throw new Error(`Fail to create "${this.name}". There is now ${direction} IObject`);
    }
    this.current = current;
  }

  public async load() {
    if (this.loaded) {
      return;
    }
    await Promise.all(Object.values(this.iObjectMap).map((iObject) => iObject?.load()));

    const photoMap: { [key: string]: string } = this.props.photoMap || DEFAULT_PHOTO_INFO;
    const photoKeys = Object.keys(photoMap);
    photoKeys.forEach((key) => Assets.add(`${this.name}:${key}`, photoMap[key]));
    this.photoTextureMap = await Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
    this.photo = new Sprite();
    this.photo.texture = this.photoTextureMap[`${this.name}:default`];

    this.loaded = true;
    this.setDirection(this.props.direction || 'down');
  }

  public isLoaded() {
    return this.loaded;
  }

  private loadCheck() {
    if (!this.loaded) {
      throw new Error(`"${this.name}" is not loaded.`);
    }
  }

  public getCollisionMod() {
    this.loadCheck();
    return this.current.getCollisionMod();
  }

  public getCollisionArea() {
    this.loadCheck();
    return this.current.getCollisionArea();
  }

  public getWidth() {
    this.loadCheck();
    return this.current.getWidth();
  }

  public getHeight() {
    this.loadCheck();
    return this.current.getHeight();
  }

  public getZIndex() {
    this.loadCheck();
    return this.current.getZIndex();
  }

  public setZIndex(zIndex?: number) {
    this.loadCheck();
    this.current.setZIndex(zIndex);
    return this;
  }

  public getPos(): Pos {
    this.loadCheck();
    const [modX, modY] = this.getCollisionMod();
    return [this.x + modX, this.y + modY];
  }

  public setPos([x, y]: Pos) {
    this.loadCheck();
    const [modX, modY] = this.getCollisionMod();
    this.x = x - modX;
    this.y = y - modY;
    this.zIndex = this.getZIndex() + y;
    return this;
  }

  public getDirection() {
    const directions: Direction[] = ['up', 'down', 'left', 'right'];
    const direction = directions.find((dir) => this.current === this.iObjectMap[dir]);
    if (!direction) {
      throw new Error('Fail to get direction. no direciton.');
    }
    return direction;
  }

  public setDirection(dir: Direction) {
    const nextIObj = this.iObjectMap[dir];
    if (!nextIObj) {
      throw new Error(`Fail to set direction. there is no "${dir}" IObject.`);
    }
    this.removeChild(this.current);

    this.current = nextIObj;
    this.addChild(this.current);
  }

  public isAnimation() {
    this.loadCheck();
    return this.current.isAnimation();
  }

  public play(acc?: number) {
    this.loadCheck();
    this.current.play(acc);
    return this;
  }

  public stop() {
    this.loadCheck();
    this.current.stop();
    return this;
  }

  public getPhoto() {
    if (!this.photo) {
      throw new Error(`Fail to get photo. "${this.name}" is not loaded.`);
    }
    return this.photo;
  }

  public isDoing() {
    console.error(this.name);
    return false;
  }
}
