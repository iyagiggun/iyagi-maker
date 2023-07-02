/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line max-classes-per-file
import {
  AnimatedSprite, BaseTexture, Sprite, Spritesheet, Texture,
} from 'pixi.js';
import { Coords } from '../Utils/Coordinate';
import { Direction } from './type';

let spriteNamePrefix = 1;

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

  private collisionModMap: {
    [key: string]: Coords;
  };

  private spriteMap: {
    [key:string]: Sprite | undefined;
  } = {};

  constructor(private imgUrl: string, private areaInfoMap: AreaInfoMap, private loop = true) {
    this.collisionModMap = Object.keys(areaInfoMap).reduce<{ [key:string]: Coords }>(
      (acc, _dir) => {
        const dir = _dir as unknown as Direction;
        const areaInfo = areaInfoMap[dir]?.coordsList[0];
        if (!areaInfo) {
          return acc;
        }
        return {
          ...acc,
          [dir]: areaInfoMap[dir]?.collisionMod || [0, 0, areaInfo[2], areaInfo[3]],
        };
      },
      {},
    );
  }

  public async load() {
    if (this.loaded) {
      return;
    }

    const framesMap = Object.keys(this.areaInfoMap).reduce<{ [key:string]: object }>((acc, dir) => ({
      ...acc,
      [dir]: coordsListToFrame(
        // eslint-disable-next-line no-plusplus
        `${spriteNamePrefix++}:${this.imgUrl}:${dir}`,
        this.areaInfoMap[dir as unknown as Direction]?.coordsList,
      ),
    }), {});

    await new Spritesheet(getTexture(this.imgUrl), {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      frames: Object.values(framesMap).reduce((acc, each) => ({ ...acc, ...each }), {}) as { [key: string]: any },
      meta: {
        scale: '1',
      },
    }).parse();

    this.spriteMap = Object.keys(framesMap).reduce((acc, dir) => ({
      ...acc,
      [dir]: getSprite(Object.keys(framesMap[dir]), this.loop),
    }), {});

    this.loaded = true;
  }

  public getSprite(dir: Direction) {
    const sprite = this.spriteMap[dir];
    if (!sprite) {
      throw new Error('[ISprite.getSprite] No the sprite.');
    }
    return sprite;
  }

  public getCollisionMod(dir: Direction): Coords {
    return this.collisionModMap[dir];
  }
}
