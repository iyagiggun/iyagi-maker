import {
  AnimatedSprite, Assets, BaseTexture,
  Sprite, Spritesheet, Texture,
} from 'pixi.js';
import { FRAMES_PER_SECOND, TRANSPARENT_1PX_IMG } from '../Constant';
import { COORDS_H_IDX, COORDS_W_IDX, Coords } from '../Utils/Coordinate';

type SpriteInfo = {
  coordsList: Coords[];
  collisionCoords?: Coords;
  loop?: boolean;
  animationSpeed?: number;
};

export type IDirection = 'up' | 'down' | 'left' | 'right';

export type IObjectInfo = {
  photoInfo?: {
    default: string;
    [key: string]: string;
  }

  spriteUrl: string;
  up?: SpriteInfo;
  down: SpriteInfo;
  left?: SpriteInfo;
  right?: SpriteInfo;

  pos?: [x: number, y: number, z?: number];
  dir?: IDirection;

  visible?: boolean;
  passable?: boolean;
};

const textureMap: { [key: string] : BaseTexture } = {};
const DEFAULT_PHOTO_INFO = { default: TRANSPARENT_1PX_IMG };

const coordsListToFrame = (prefix: string) => (coordsList: Coords[] | undefined) => {
  if (!coordsList) {
    return {};
  }
  return coordsList.reduce((frames, [x, y, w, h], idx) => ({
    ...frames,
    [`${prefix}-${idx}`]: {
      frame: {
        x, y, w, h,
      },
    },
  }), {});
};

const getSprite = (frameKeyList: string[], animationSpeed = 1, loop = true) => {
  if (frameKeyList.length === 1) {
    return Sprite.from(frameKeyList[0]);
  }
  if (frameKeyList.length > 1) {
    const aSprite = new AnimatedSprite(frameKeyList.map((key) => Texture.from(key)));
    aSprite.loop = loop;
    aSprite.animationSpeed = animationSpeed;
    return aSprite;
  }
  return undefined;
};

const getDirection = (deltaX: number, deltaY: number) => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left';
  }
  return deltaY > 0 ? 'down' : 'up';
};

export default class IObject {
  private photo;

  private photoTextureMap?: { [key: string]: Texture };

  // 현재 sprite. load 후 값이 세팅 됨 - loaded 판단할 때 사용
  private sprite: Sprite | undefined;

  private upS: Sprite | undefined;

  private downS: Sprite | undefined;

  private leftS: Sprite | undefined;

  private rightS: Sprite | undefined;

  private passable: boolean;

  private collisionMod?: Coords;

  private reaction?: () => Promise<void>;

  constructor(private name: string, private objInfo: IObjectInfo) {
    this.passable = objInfo.passable ?? false;
    this.photo = new Sprite();
  }

  private getDirFrames() {
    return {
      up: coordsListToFrame(`${this.name}-up`)(this.objInfo.up?.coordsList),
      down: coordsListToFrame(`${this.name}-down`)(this.objInfo.down.coordsList),
      left: coordsListToFrame(`${this.name}-left`)(this.objInfo.left?.coordsList),
      right: coordsListToFrame(`${this.name}-right`)(this.objInfo.right?.coordsList),
    };
  }

  public isLoaded() {
    return !!this.sprite;
  }

  public async load() {
    // case: loaded
    if (this.isLoaded()) {
      return;
    }
    // case: still not loaded

    // Load Texture
    const dirFrames = this.getDirFrames();
    await new Spritesheet(this.getTexture(), {
      frames: Object.values(dirFrames).reduce((acc, _frames) => {
        if (!_frames) {
          return acc;
        }
        return {
          ...acc,
          ..._frames,
        };
      }, {}),
      meta: {
        scale: '1',
      },
    }).parse();

    this.upS = getSprite(
      Object.keys(dirFrames.up),
      this.objInfo.up?.animationSpeed,
      this.objInfo.up?.loop,
    );
    this.downS = getSprite(
      Object.keys(dirFrames.down),
      this.objInfo.up?.animationSpeed,
      this.objInfo.up?.loop,
    );
    this.leftS = getSprite(
      Object.keys(dirFrames.left),
      this.objInfo.up?.animationSpeed,
      this.objInfo.up?.loop,
    );
    this.rightS = getSprite(
      Object.keys(dirFrames.right),
      this.objInfo.up?.animationSpeed,
      this.objInfo.up?.loop,
    );

    this.setDirection(this.objInfo.dir || 'down');
    this.getSprite().visible = this.objInfo.visible ?? true;

    const [posX, posY, zMod] = this.objInfo.pos || [0, 0];
    this.setPos(posX, posY, zMod);

    // Load Photo
    const photoInfo: { [key: string]: string } = this.objInfo.photoInfo || DEFAULT_PHOTO_INFO;
    const photoKeys = Object.keys(photoInfo);
    photoKeys.forEach((key) => Assets.add(`${this.name}:${key}`, photoInfo[key]));
    this.photoTextureMap = await Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
    this.photo.texture = this.photoTextureMap[`${this.name}:default`];
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

  public getSprite() {
    if (!this.sprite) {
      throw new Error(`asset '${this.name}' is not loaded`);
    }
    return this.sprite;
  }

  public getCollisionMod() {
    if (!this.collisionMod) {
      const sprite = this.getSprite();
      return [0, 0, sprite.width, sprite.height];
    }
    return this.collisionMod;
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

  private getTexture() {
    const { spriteUrl } = this.objInfo;
    if (!textureMap[spriteUrl]) {
      textureMap[spriteUrl] = BaseTexture.from(spriteUrl);
    }
    return textureMap[spriteUrl];
  }

  public getPos(): [number, number] {
    const [modX, modY] = this.getCollisionMod();
    const { x: spriteX, y: spriteY } = this.getSprite();
    return [spriteX + modX, spriteY + modY];
  }

  public setPos(x: number, y: number, zMod = 0) {
    const [modX, modY] = this.getCollisionMod();
    const sprite = this.getSprite();
    sprite.x = x - modX;
    sprite.y = y - modY;
    sprite.zIndex = sprite.y + sprite.height + zMod;
    return this;
  }

  public getWidth() {
    return this.getCollisionMod()[COORDS_W_IDX];
  }

  public getHeight() {
    return this.getCollisionMod()[COORDS_H_IDX];
  }

  public getGlobalPos() {
    const [modX, modY] = this.getCollisionCoords();
    const { x: globalX, y: globalY } = this.getSprite().getGlobalPosition();
    return [globalX + modX, globalY + modY];
  }

  public getCollisionCoords() {
    const [x, y] = this.getPos();
    const [, , colsW, colsH] = this.getCollisionMod();
    return [x, y, colsW, colsH];
  }

  public getDirection(): IDirection {
    switch (this.sprite) {
      case this.upS:
        return 'up';
      case this.downS:
        return 'down';
      case this.leftS:
        return 'left';
      case this.rightS:
        return 'right';
      default:
        throw new Error(`[IObjet: ${this.name}] Invalid direction. ${this.name} / ${!!this.sprite}`);
    }
  }

  public changeDirection(deltaX: number, deltaY: number) {
    return this.setDirection(getDirection(deltaX, deltaY));
  }

  public setDirection(direction: IDirection) {
    const lastSprite = this.sprite;
    const [lastX, lastY] = lastSprite ? this.getPos() : [0, 0];
    switch (direction) {
      case 'up':
        this.sprite = this.upS;
        this.collisionMod = this.objInfo.up?.collisionCoords;
        break;
      case 'down':
        this.sprite = this.downS;
        this.collisionMod = this.objInfo.down.collisionCoords;
        break;
      case 'left':
        this.sprite = this.leftS;
        this.collisionMod = this.objInfo.left?.collisionCoords;
        break;
      case 'right':
        this.sprite = this.rightS;
        this.collisionMod = this.objInfo.right?.collisionCoords;
        break;
      default:
        throw new Error(`Fail to change ${this.name} dir. Invalid direction. ${direction}`);
    }
    if (!this.sprite) {
      throw new Error(`Fail to change ${this.name} dir. no sprite. ${direction}`);
    }
    if (!lastSprite) {
      return this;
    }
    this.setPos(lastX, lastY);
    const { parent } = lastSprite;
    if (parent) {
      if (lastSprite instanceof AnimatedSprite) {
        lastSprite.stop();
      }
      parent.removeChild(lastSprite);
      parent.addChild(this.sprite);
    }
    return this;
  }

  public play(_speed: number) {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      return;
    }
    if (!sprite.playing) {
      sprite.play();
    }
    const speed = (_speed * 6) / FRAMES_PER_SECOND;
    if (sprite.animationSpeed === speed) {
      return;
    }
    sprite.animationSpeed = speed;
  }

  public isPlaying() {
    if (!(this.sprite instanceof AnimatedSprite)) {
      return false;
    }
    return this.sprite.playing;
  }

  public stop() {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      return;
    }
    sprite.stop();
  }

  public hide() {
    this.getSprite().visible = false;
  }

  public show() {
    this.getSprite().visible = true;
  }

  public wait(time = 0) {
    const sprite = this.getSprite();
    const playing = sprite instanceof AnimatedSprite ? sprite.playing : false;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (playing && sprite instanceof AnimatedSprite) {
          sprite.play();
        }
        resolve();
      }, time);
    });
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
}
