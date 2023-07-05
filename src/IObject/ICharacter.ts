import {
  AnimatedSprite,
  Assets,
  Sprite, Texture,
} from 'pixi.js';
import IObject, { ISpriteMap } from '.';
import { TRANSPARENT_1PX_IMG } from '../Constant';

export type PhotoMap = {
  default: string;
  [key: string]: string;
};

const DEFAULT_PHOTO_INFO = { default: TRANSPARENT_1PX_IMG };

export default class ICharacter extends IObject {
  private photo: Sprite;

  private doing = false;

  private photoTextureMap: {
    [key: string]: Texture;
  } = {};

  constructor(name: string, iSpriteMap: ISpriteMap, private photoMap?: PhotoMap) {
    super(name, iSpriteMap);
    this.photo = new Sprite();
  }

  async load() {
    const photoMap: { [key: string]: string } = this.photoMap || DEFAULT_PHOTO_INFO;
    const photoKeys = Object.keys(photoMap);
    photoKeys.forEach((key) => Assets.add(`${this.name}:${key}`, photoMap[key]));
    this.photoTextureMap = await Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
    this.photo.texture = this.photoTextureMap[`${this.name}:default`];

    await super.load();
  }

  public getPhoto() {
    return this.photo;
  }

  /**
   * not loop animation
   * @param actionSpriteKey
   * @returns
   */
  public do(actionSpriteKey: string) {
    return new Promise<boolean>((resolve, reject) => {
      if (this.doing) {
        resolve(false);
        return;
      }
      this.doing = true;

      const lastSpriteKey = Object.keys(this.iSpriteMap).find((key) => this.iSprite === this.iSpriteMap[key]);
      if (!lastSpriteKey) {
        reject(new Error('ICharacter.do] Fail to find last sprite key.'));
        return;
      }
      try {
        this.change(actionSpriteKey);
        const sprite = this.getSprite();
        if (!(sprite instanceof AnimatedSprite)) {
          throw new Error(`[ICharacter.do] The action is not animated. "${this.name}". ${actionSpriteKey}`);
        }
        const onComplete = () => {
          this.change(lastSpriteKey);
          this.doing = false;
          sprite.onComplete = undefined;
          resolve(true);
        };
        sprite.loop = false;
        sprite.gotoAndPlay(0);
        sprite.onComplete = onComplete;
      } catch (e) {
        reject(e);
        this.change(lastSpriteKey);
      }
    });
  }

  public isDoing() {
    return this.doing;
  }
}
