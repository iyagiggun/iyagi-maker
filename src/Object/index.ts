import { BaseTexture, Sprite, Spritesheet } from 'pixi.js';

const textureMap: { [key: string] : BaseTexture } = {};

export type SpriteInfo = {
  imageUrl: string;
  area: [x: number, y: number, w: number, h: number];
}

export default class IGObject {

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

  public async load() {
    const [x, y, w, h] = this.spriteInfo.area;
    await new Spritesheet(this.getTexture(), {
      frames: {
        [this.name]: {
          'frame': { x, y, w, h }
        },
      },
      meta: {
        scale: '1'
      }
    }).parse();
    this.sprite = Sprite.from(this.name);
  }

  public getSprite() {
    if (!this.sprite) {
      throw new Error(`asset '${this.name}' is not loaded`);
    }
    return this.sprite;
  }

  public bye() {
    console.error('bye');
  }

}
