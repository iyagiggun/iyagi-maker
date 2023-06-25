import {
  Assets,
  Sprite, Texture,
} from 'pixi.js';
import IObject, { IObjectProps } from '.';
import { TRANSPARENT_1PX_IMG } from '../Constant';

export type ICharacterProps = IObjectProps & {
  photoMap?: {
    default: string;
    [key: string]: string;
  }
};

const DEFAULT_PHOTO_INFO = { default: TRANSPARENT_1PX_IMG };

export default class ICharacter<T = void> extends IObject {
  private loaded = false;

  private status: T;

  private photo?: Sprite;

  private photoTextureMap?: { [key: string]: Texture };

  constructor(private cProps: ICharacterProps & {
    status: T
  }) {
    super(cProps);
    this.name = cProps.name;

    this.status = cProps.status;
  }

  public async load() {
    if (this.loaded) {
      return;
    }
    await super.load();

    const photoMap: { [key: string]: string } = this.cProps.photoMap || DEFAULT_PHOTO_INFO;
    const photoKeys = Object.keys(photoMap);
    photoKeys.forEach((key) => Assets.add(`${this.name}:${key}`, photoMap[key]));
    this.photoTextureMap = await Assets.load(photoKeys.map((key) => `${this.name}:${key}`));
    this.photo = new Sprite();
    this.photo.texture = this.photoTextureMap[`${this.name}:default`];

    this.loaded = true;
  }

  public getPhoto() {
    if (!this.photo) {
      throw new Error(`Fail to get photo. "${this.name}" is not loaded.`);
    }
    return this.photo;
  }

  public isDoing() {
    console.error(this.name);
    return false;
  }
}
