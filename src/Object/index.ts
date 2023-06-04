import {
  Assets,
  Container,
  Sprite,
  Texture,
} from 'pixi.js';
import { TRANSPARENT_1PX_IMG } from '../Constant';
import ISprite from './ISprite';

export type IDirection = 'up' | 'down' | 'left' | 'right';

export type IObjectInfo = {
  photoInfo?: {
    default: string;
    [key: string]: string;
  }

  pos?: [x: number, y: number, z?: number];
  dir?: IDirection;

  visible?: boolean;
  passable?: boolean;

  sprites: {
    default: ISprite;
    [key: string]: ISprite;
  }
};

const DEFAULT_PHOTO_INFO = { default: TRANSPARENT_1PX_IMG };

const getDirection = (deltaX: number, deltaY: number) => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left';
  }
  return deltaY > 0 ? 'down' : 'up';
};

export default class IObject {
  private photo;

  private photoTextureMap?: { [key: string]: Texture };

  private loaded = false;

  private isprite: ISprite | undefined;

  private passable: boolean;

  private reaction?: () => Promise<void>;

  constructor(private name: string, private info: IObjectInfo) {
    this.passable = info.passable ?? false;
    this.photo = new Sprite();
  }

  public isLoaded() {
    return this.loaded;
  }

  public async load() {
    if (this.loaded) {
      return;
    }
    await Promise.all(Object.values(this.info.sprites).map((sprite) => sprite.load()));
    this.isprite = this.info.sprites.default;

    const [posX, posY, zMod] = this.info.pos || [0, 0];
    this.setPos(posX, posY, zMod);

    // Load Photo
    const photoInfo: { [key: string]: string } = this.info.photoInfo || DEFAULT_PHOTO_INFO;
    const photoKeys = Object.keys(photoInfo);
    photoKeys.forEach((key) => Assets.add(`${this.name}:${key}`, photoInfo[key]));
    this.photoTextureMap = await Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
    this.photo.texture = this.photoTextureMap[`${this.name}:default`];

    this.loaded = true;
  }

  public getName() {
    return this.name;
  }

  public getPhoto() {
    return this.photo;
  }

  public changePhoto(key: string) {
    if (!this.photoTextureMap) {
      throw new Error('No photo texture map.');
    }
    // 없으면 pixi.js 에서 알아서 에러 생성해줌
    this.photo.texture = this.photoTextureMap[key];
  }

  public getISprite() {
    if (!this.isprite) {
      throw new Error(`Fail to get "${this.name}" sprite.`);
    }
    return this.isprite;
  }

  public getCollisionMod() {
    return this.getISprite().getCollisionMod();
  }

  public setReaction(reaction: () => Promise<void>) {
    this.reaction = reaction;
  }

  public getReaction() {
    return this.reaction;
  }

  public async react() {
    await this.reaction?.();
  }

  public isPassable() {
    return this.passable;
  }

  public getPos(): [number, number] {
    return this.getISprite().getPos();
  }

  public setPos(x: number, y: number, zMod = 0) {
    this.getISprite().setPos(x, y, zMod);
    return this;
  }

  public getWidth() {
    return this.getISprite().getWidth();
  }

  public getHeight() {
    return this.getISprite().getHeight();
  }

  public getGlobalPos() {
    return this.getISprite().getGlobalPos();
  }

  public getCollisionCoords() {
    return this.getISprite().getCollisionCoords();
  }

  public getDirection(): IDirection {
    return this.getISprite().getDirection();
  }

  public changeDirection(deltaX: number, deltaY: number) {
    return this.setDirection(getDirection(deltaX, deltaY));
  }

  public setDirection(direction: IDirection) {
    this.getISprite().setDirection(direction);
    return this;
  }

  public play(acc = 1) {
    this.getISprite().play(acc);
    return this;
  }

  public isPlaying() {
    return this.getISprite().isPlaying();
  }

  public stop() {
    this.getISprite().stop();
    return this;
  }

  public hide() {
    this.getISprite().hide();
    return this;
  }

  public show() {
    this.getISprite().show();
    return this;
  }

  public getCenterPos(): [number, number] {
    const [x, y] = this.getPos();
    return [x + this.getWidth() / 2, y + this.getHeight() / 2];
  }

  public getCoordinateRelationship(target: IObject) {
    const [x, y] = this.getCenterPos();
    const halfWidth = this.getWidth() / 2;
    const halfHeight = this.getHeight() / 2;
    const [tx, ty] = target.getCenterPos();
    const tHalfWidth = target.getWidth() / 2;
    const tHalfHeight = target.getHeight() / 2;

    const xDiff = tx - x;
    const yDiff = ty - y;

    // y 축이 동일하면 삼각함수 못씀
    if (xDiff === 0) {
      const distance = Math.abs(yDiff - halfHeight - tHalfHeight);
      return {
        distance, xDiff, yDiff,
      };
    }
    // x 축이 동일하면 삼각함수 못씀
    if (yDiff === 0) {
      const distance = Math.abs(xDiff - halfWidth - tHalfWidth);
      return {
        distance, xDiff, yDiff,
      };
    }

    // 중심점 간 거리
    const cDistance = Math.sqrt(xDiff ** 2 + yDiff ** 2);
    // x 축으로 겹쳐 있다면 sin 으로 구해야 함.
    if (xDiff < halfWidth + tHalfWidth) {
      const arcSin = Math.abs(cDistance / yDiff);
      const distance = cDistance - arcSin * halfHeight - arcSin * tHalfHeight;
      return {
        distance, xDiff, yDiff,
      };
    }
    // y축으로 겹쳐있거나 나머지의 경우는 cos 으로 구함.
    const arcCos = Math.abs(cDistance / xDiff);
    const distance = cDistance - arcCos * halfWidth - arcCos * tHalfWidth;
    return {
      distance, xDiff, yDiff,
    };
  }

  public attach(container: Container) {
    if (!this.isprite) {
      throw new Error(`Fail to attach "${this.name}". no sprite.`);
    }
    this.isprite.attach(container);
  }

  public detach(container: Container) {
    if (!this.isprite) {
      throw new Error(`Fail to detach "${this.name}". no sprite.`);
    }
    this.isprite.detach(container);
  }

  public do(spriteName: string) {
    const spriteDo = this.info.sprites[spriteName];
    if (!spriteDo) {
      throw new Error(`Fail to do "${spriteName}"`);
    }

    const last = this.getISprite();
    last.replace(spriteDo);

    if (!spriteDo.isLoopAnimation()) {
      spriteDo.addEventListener('onComplete', () => {
        spriteDo.replace(last);
      });
    }

    spriteDo.play();
  }
}
