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

let spriteNamePrefix = 1;

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

export type ISprite = {
  _imgUrl: string;
  _loaded: boolean;
  _areaInfoMap: AreaInfoMap;
  _loop: boolean;
  _spriteMap: {
    [key: string]: Sprite | undefined;
  };
  _collisionModMap: {
    [key: string]: Coords;
  }
  init(): void;
  load(): Promise<void>
  getSprite(dir: Direction): Sprite;
  getCollisionMod(dir: Direction): Coords;
};

export const ISpritePrototype = {
  async load() {
    if (this._loaded) {
      return;
    }
    const framesMap = Object.keys(this._areaInfoMap).reduce<{ [key:string]: object }>((acc, dir) => ({
      ...acc,
      [dir]: coordsListToFrame(
        // eslint-disable-next-line no-plusplus
        `${spriteNamePrefix++}:${this._imgUrl}:${dir}`,
        this._areaInfoMap[dir as unknown as Direction]?.coordsList,
      ),
    }), {});

    await new Spritesheet(getTexture(this._imgUrl), {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      frames: Object.values(framesMap).reduce((acc, each) => ({ ...acc, ...each }), {}) as { [key: string]: any },
      meta: {
        scale: '1',
      },
    }).parse();

    this._spriteMap = Object.keys(framesMap).reduce((acc, dir) => ({
      ...acc,
      [dir]: getSprite(Object.keys(framesMap[dir]), this._loop),
    }), {});

    this._loaded = true;
  },

  getSprite(dir: Direction) {
    const sprite = this._spriteMap[dir];
    if (!sprite) {
      throw new Error('[ISprite.getSprite] No the sprite.');
    }
    return sprite;
  },

  getCollisionMod(dir: Direction): Coords {
    return this._collisionModMap[dir];
  },
} as ISprite;

export const ISpriteMaker = {
  from(imgUrl: string, areaInfoMap: AreaInfoMap, loop = true) {
    const iSprite = Object.create(ISpritePrototype);
    iSprite._imgUrl = imgUrl;
    iSprite._areaInfoMap = areaInfoMap;
    iSprite._loop = loop;
    iSprite._collisionModMap = Object.keys(areaInfoMap).reduce<{ [key:string]: Coords }>(
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
    return iSprite;
  },
};
