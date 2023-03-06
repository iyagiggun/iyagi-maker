import { AnimatedSprite, BaseTexture, Container, Sprite, Spritesheet, Texture } from 'pixi.js';
import { FRAMES_PER_SECOND } from '../Constant';

const textureMap: { [key: string] : BaseTexture } = {};

type Coords = [x: number, y: number, w: number, h: number];

type SpriteInfo = {
  coordsList: Coords[];
  xDiff?: number;
  yDiff?: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

export type IObjectInfo = {
  imageUrl: string;
  up?: SpriteInfo;
  down: SpriteInfo;
  left?: SpriteInfo;
  right?: SpriteInfo;
  visible?: boolean;
  passable?: boolean;
}

const coordsListToFrame = (prefix: string) => (coordsList: Coords[] | undefined) => {
  if (!coordsList) {
    return {};
  }
  return coordsList.reduce((frames, [x, y, w, h], idx) => {
    return {
      ...frames,
      [`${prefix}-${idx}`]: {
        frame: { x, y, w, h }
      }
    };
  }, {});
};

const getSprite = (frameKeyList: string[]) => {
  if (frameKeyList.length === 1) {
    return Sprite.from(frameKeyList[0]);
  }
  if (frameKeyList.length > 1) {
    return new AnimatedSprite(frameKeyList.map((key) => Texture.from(key)));
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
  // 현재 sprite. load 후 값이 세팅 됨 - loaded 판단할 때 사용
  private sprite: Sprite | undefined;

  private upS: Sprite | undefined;
  private downS: Sprite | undefined;
  private leftS: Sprite | undefined;
  private rightS: Sprite | undefined;

  private passable: boolean;
  private xDiff = 0;
  private yDiff = 0;

  private reaction?: () => Promise<void>;

  constructor(private name: string, private objInfo: IObjectInfo) {
    this.passable = objInfo.passable ?? false;
  }

  public getName() {
    return this.name;
  }

  public attachAt(container: Container) {
    container.addChild(this.getSprite());
  }

  public setReact(reaction: () => Promise<void>) {
    this.reaction = reaction;
  }

  public react() {
    this.reaction?.();
  }

  public isPassable() {
    return this.passable;
  }

  private getTexture() {
    const imageUrl = this.objInfo.imageUrl;
    if (!textureMap[imageUrl]) {
      textureMap[imageUrl] = BaseTexture.from(imageUrl);
    }
    return textureMap[imageUrl];
  }

  private getDirFrames() {
    return {
      up: coordsListToFrame(`${this.name}-up`)(this.objInfo.up?.coordsList),
      down: coordsListToFrame(`${this.name}-down`)(this.objInfo.down.coordsList),
      left: coordsListToFrame(`${this.name}-left`)(this.objInfo.left?.coordsList),
      right: coordsListToFrame(`${this.name}-right`)(this.objInfo.right?.coordsList)
    };
  }

  public async load() {
    // case: loaded
    if (this.sprite) {
      return Promise.resolve();
    }
    // case: still not loaded
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
      }
    }).parse();

    this.upS = getSprite(Object.keys(dirFrames.up));
    this.downS = getSprite(Object.keys(dirFrames.down));
    this.leftS = getSprite(Object.keys(dirFrames.left));
    this.rightS = getSprite(Object.keys(dirFrames.right));

    this.sprite = this.downS;
    if (this.sprite === undefined) {
      throw new Error(`Fail to load ${this.name}. Down sprite info is required.`);
    }
    this.sprite.visible == this.objInfo.visible ?? true;
    this.xDiff = this.objInfo.down.xDiff ?? 0;
    this.yDiff = this.objInfo.down.yDiff ?? 0;
    this.setPos(0, 0);
  }

  private getSprite() {
    if (!this.sprite) {
      throw new Error(`asset '${this.name}' is not loaded`);
    }
    return this.sprite;
  }

  public getWidth() {
    return this.getSprite().width + this.xDiff;
  }

  public getHeight() {
    return this.getSprite().height + this.yDiff;
  }

  public getPos() {
    const { x, y } = this.getSprite();
    return [x - this.xDiff, y - this.yDiff];
  }

  public getGlobalPos() {
    const { x, y } = this.getSprite().getGlobalPosition();
    return [x - this.xDiff, y - this.yDiff];
  }

  public setPos(x: number, y: number, zIndexGap = 0) {
    const sprite = this.getSprite();
    sprite.x = x + this.xDiff;
    sprite.y = y + this.yDiff;
    sprite.zIndex = y + zIndexGap;
  }

  public getDirection(): Direction {
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

  public setDirection(direction: Direction) {
    const lastSprite = this.getSprite();
    const [lastX, lastY] = this.getPos();
    const parent = lastSprite.parent;
    switch (direction) {
    case 'up':
      this.sprite = this.upS;
      this.xDiff = this.objInfo.up?.xDiff ?? 0;
      this.yDiff = this.objInfo.up?.yDiff ?? 0;
      break;
    case 'down':
      this.sprite = this.downS;
      this.xDiff = this.objInfo.down.xDiff ?? 0;
      this.yDiff = this.objInfo.down.yDiff ?? 0;
      break;
    case 'left':
      this.sprite = this.leftS;
      this.xDiff = this.objInfo.left?.xDiff ?? 0;
      this.yDiff = this.objInfo.left?.yDiff ?? 0;
      break;
    case 'right':
      this.sprite = this.rightS;
      this.xDiff = this.objInfo.right?.xDiff ?? 0;
      this.yDiff = this.objInfo.right?.yDiff ?? 0;
      break;
    default:
      throw new Error(`Fail to change ${this.name} dir. Invalid direction. ${direction}`);
    }
    if (!this.sprite) {
      throw new Error(`Fail to change ${this.name} dir. no sprite. ${direction}`);
    }
    this.setPos(lastX, lastY);
    if (parent) {
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

  public stop() {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      return;
    }
    sprite.stop();
  }

  public wait(time = 0) {
    const sprite = this.getSprite();
    const playing = sprite instanceof AnimatedSprite ? sprite.playing : false;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if ( playing && sprite instanceof AnimatedSprite ) {
          sprite.play();
        }
        resolve();
      }, time);
    });
  }
}
