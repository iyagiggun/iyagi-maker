/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line max-classes-per-file
import {
  AnimatedSprite, BaseTexture, Sprite, Spritesheet, Texture,
} from 'pixi.js';
import { Coords } from '../Utils/Coordinate';
import { Direction } from './type';

const TEXTURE_MAP: { [key: string] : BaseTexture } = {};
const getTexture = (imgUrl: string) => {
  if (!TEXTURE_MAP[imgUrl]) {
    TEXTURE_MAP[imgUrl] = BaseTexture.from(imgUrl);
  }
  return TEXTURE_MAP[imgUrl];
};

const coordsListToFrame = (prefix: string, coordsList?: Coords[]) => {
  if (!coordsList) {
    return {};
  }
  return coordsList.reduce((frames, [x, y, w, h], idx) => ({
    ...frames,
    [`${prefix}:${idx}`]: {
      frame: {
        x, y, w, h,
      },
    },
  }), {});
};

const getSprite = (
  frameKeyList: string[],
  loop = true,
) => {
  if (frameKeyList.length === 1) {
    return Sprite.from(frameKeyList[0]);
  }
  if (frameKeyList.length > 1) {
    const aSprite = new AnimatedSprite(frameKeyList.map((key) => Texture.from(key)));
    aSprite.loop = loop;
    return aSprite;
  }
  return undefined;
};

type AreaInfo = {
  coordsList: Coords[];
  collisionMod?: Coords;
};

type AreaInfoMap = {
  up?: AreaInfo;
  down: AreaInfo;
  left?: AreaInfo;
  right?: AreaInfo;
};

export default class ISprite {
  private loaded = false;

  private spriteMap: {
    [key:string]: Sprite | undefined;
  } = {};

  constructor(private imgUrl: string, private areaInfoMap: AreaInfoMap, private loop = true) {

  }

  public async load() {
    if (this.loaded) {
      return;
    }
    const loadList = Object.keys(this.areaInfoMap).map(async (key) => {
      switch (key) {
        case 'up':
        case 'down':
        case 'left':
        case 'right': {
          const frames = coordsListToFrame(
            `${this.imgUrl}:${key}`,
            this.areaInfoMap[key]?.coordsList,
          );
          await new Spritesheet(getTexture(this.imgUrl || ''), {
            frames: {
              ...frames,
            },
            meta: {
              scale: '1',
            },
          }).parse();
          this.spriteMap[key] = getSprite(Object.keys(frames), this.loop);
        }
          break;
        default:
          throw new Error('[ISprite.load] Invalid key.');
      }
    });
    await Promise.all(loadList);
    this.loaded = true;
  }

  public getSprite(dir: Direction) {
    if (!this.loaded) {
      throw new Error('[ISprite.getSprite] Not loaded.');
    }
    let sprite: Sprite | undefined;
    switch (dir) {
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        sprite = this.spriteMap[dir];
        break;
      default:
        throw new Error('[ISprite.getSprite] Invalid dir.');
    }
    if (!sprite) {
      throw new Error('[ISprite.getSprite] No sprite.');
    }
    return sprite;
  }

  public getCollisionMod(dir: Direction): Coords {
    if (!this.loaded) {
      throw new Error('[ISprite.getCollisionMod] Not loaded.');
    }
    let collisionMod: Coords | undefined;
    switch (dir) {
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        collisionMod = this.areaInfoMap[dir]?.collisionMod;
        break;
      default:
        throw new Error('[ISprite.getCollisionMod] Invalid dir.');
    }
    if (!collisionMod) {
      const sprite = this.getSprite(dir);
      return [0, 0, sprite.width, sprite.height];
    }
    return collisionMod;
  }
}
