import { AnimatedSprite, BaseTexture, Sprite, Spritesheet, Texture } from 'pixi.js';
import { FRAMES_PER_SECOND } from '../Constant';

const textureMap: { [key: string] : BaseTexture } = {};

type Coords = [x: number, y: number, w: number, h: number];
type Direction = 'up' | 'down' | 'left' | 'right';

export type SpriteInfo = {
  imageUrl: string;
  up?: Coords[];
  down: Coords[];
  left?: Coords[];
  right?: Coords[];
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

  private upS: Sprite | undefined;
  private downS: Sprite | undefined;
  private leftS: Sprite | undefined;
  private rightS: Sprite | undefined;

  // load 시 값이 세팅 됨 - loaded 판단할 때 사용
  private sprite: Sprite | undefined;

  private passable: boolean;

  constructor(private name: string, private spriteInfo: SpriteInfo) {
    this.passable = spriteInfo.passable ?? false;
  }

  public getName() {
    return this.name;
  }

  public isPassable() {
    return this.passable;
  }

  private getTexture() {
    const imageUrl = this.spriteInfo.imageUrl;
    if (!textureMap[imageUrl]) {
      textureMap[imageUrl] = BaseTexture.from(imageUrl);
    }
    return textureMap[imageUrl];
  }

  private getDirFrames() {
    return {
      up: coordsListToFrame(`${this.name}-up`)(this.spriteInfo.up),
      down: coordsListToFrame(`${this.name}-down`)(this.spriteInfo.down),
      left: coordsListToFrame(`${this.name}-left`)(this.spriteInfo.left),
      right: coordsListToFrame(`${this.name}-right`)(this.spriteInfo.right)
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
    this.sprite.visible == this.spriteInfo.visible ?? true;
  }

  public getSprite() {
    if (!this.sprite) {
      throw new Error(`asset '${this.name}' is not loaded`);
    }
    return this.sprite;
  }

  public getWidth() {
    return this.getSprite().width;
  }

  public getHeight() {
    return this.getSprite().height;
  }

  public getPos() {
    const {x, y} = this.getSprite();
    return [x, y];
  }

  public setPos(x: number, y: number) {
    this.getSprite().x = x;
    this.getSprite().y = y;
  }

  public changeDirectionWithDelta(deltaX: number, deltaY: number) {
    this.changeDirection(getDirection(deltaX, deltaY));

  }

  public changeDirection(direction: Direction) {
    const lastSprite = this.getSprite();
    const [lastX, lastY] = this.getPos();
    const parent = lastSprite.parent;
    switch (direction) {
    case 'up':
      this.sprite = this.upS;
      break;
    case 'down':
      this.sprite = this.downS;
      break;
    case 'left':
      this.sprite = this.leftS;
      break;
    case 'right':
      this.sprite = this.rightS;
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
}
