import { AnimatedSprite, BaseTexture, Sprite, Spritesheet, Texture } from 'pixi.js';

const textureMap: { [key: string] : BaseTexture } = {};

type Coords = [x: number, y: number, w: number, h: number];

export type SpriteInfo = {
  imageUrl: string;
  up?: Coords[];
  down: Coords[];
  left?: Coords[];
  right?: Coords[];
  visible?: boolean;
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

export default class IObject {

  private upS: Sprite | undefined;
  private downS: Sprite | undefined;
  private leftS: Sprite | undefined;
  private rightS: Sprite | undefined;

  // load 시 값이 세팅 됨 - loaded 판단할 때 사용
  private sprite: Sprite | undefined;

  constructor(private name: string, private spriteInfo: SpriteInfo) {
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
    if (!this.sprite) {
      throw new Error(`Fail to load ${this.name}. No down sprite data.`);
    }
    this.sprite.visible == this.spriteInfo.visible ?? true;
  }

  public getSprite() {
    if (!this.sprite) {
      throw new Error(`asset '${this.name}' is not loaded`);
    }
    return this.sprite;
  }
}
