import {
  AnimatedSprite,
  Assets,
  Sprite, Texture,
} from 'pixi.js';
import {
  IObject, IObjectMaker, IObjectPrototype, ISpriteMap,
} from '.';
import { TRANSPARENT_1PX_IMG } from '../Constant';

export type PhotoMap = {
  default: string;
  [key: string]: string;
};

const DEFAULT_PHOTO_INFO = { default: TRANSPARENT_1PX_IMG };

export type ICharacter = IObject & {
  _photo: Sprite;
  _photoMap: PhotoMap;
  _photoTextureMap: {
    [key: string]: Texture;
  };
  _doing: boolean;
  load(): Promise<void>;
  getPhoto(): Sprite;
  isDoing(): boolean;
  do(actionISpriteKey: string): ICharacter;

};

export const ICharacterPrototype = Object.assign(Object.create(IObjectPrototype), {
  async load() {
    const photoMap = this._photoMap;
    const photoKeys = Object.keys(photoMap);
    photoKeys.forEach((key) => Assets.add(`${this.name}:${key}`, photoMap[key]));
    this._photoTextureMap = await Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
    this._photo.texture = this._photoTextureMap[`${this.name}:default`];
    await IObjectPrototype.load.call(this);
  },
  getPhoto() {
    return this._photo;
  },
  do(actionISpriteKey: string) {
    if (this._doing) {
      return;
    }
    this._doing = true;
    const lastSpriteKey = Object.keys(this._iSpriteMap).find((key) => this._iSpriteMap[key] === this._iSprite);
    if (!lastSpriteKey) {
      throw new Error('[ICharacter.do] Fail to get last sprite key');
    }
    try {
      this.change(actionISpriteKey);
      const sprite = this.getSprite();
      if (!(sprite instanceof AnimatedSprite)) {
        throw new Error(`[ICharacter.do] The action is not animated. "${this.name}". ${actionISpriteKey}`);
      }
      const onComplete = () => {
        this.change(lastSpriteKey);
        this._doing = false;
        sprite.onComplete = undefined;
      };
      sprite.gotoAndPlay(0);
      sprite.onComplete = onComplete;
      this.play();
    } catch (e) {
      this.change(lastSpriteKey);
      throw e;
    }
  },
  isDoing() {
    return this._doing;
  },
} as ICharacter);

export const ICharacterMaker = {
  from(name: string, iSpriteMap: ISpriteMap, photoMap?: PhotoMap) {
    const iCharacter = IObjectMaker.from(name, iSpriteMap) as ICharacter;
    Object.setPrototypeOf(iCharacter, ICharacterPrototype);
    iCharacter._photo = new Sprite();
    iCharacter._photoMap = photoMap || DEFAULT_PHOTO_INFO;
    iCharacter._doing = false;
    return iCharacter;
  },
};
