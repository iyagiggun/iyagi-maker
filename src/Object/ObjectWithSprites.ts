import ISprite, { IDirection, getDirection } from './ISprite';
import ObjectBase from './ObjectBase';

export type SpriteMap = {
  default: ISprite;
  [key: string]: ISprite
};

export default class ObjectWithSprites extends ObjectBase {
  private current: ISprite | undefined;

  private spriteMap: SpriteMap;

  private doing = false;

  constructor(name: string, spriteMap: SpriteMap) {
    super(name);
    this.spriteMap = spriteMap;
  }

  public async load() {
    await Promise.all(Object.values(this.spriteMap).map((sprite) => sprite.load()));
    this.current = this.spriteMap.default;
  }

  protected getSprite() {
    if (!this.current) {
      throw new Error(`Fail to get "${this.name}" sprite.`);
    }
    return this.current;
  }

  public getPos(): [number, number] {
    return this.getSprite().getPos();
  }

  public setPos(x: number, y: number, zMod = 0) {
    this.getSprite().setPos(x, y, zMod);
    return this;
  }

  public getWidth() {
    return this.getSprite().getWidth();
  }

  public getHeight() {
    return this.getSprite().getHeight();
  }

  public getGlobalPos() {
    return this.getSprite().getGlobalPos();
  }

  public getCollisionCoords() {
    return this.getSprite().getCollisionCoords();
  }

  public getDirection(): IDirection {
    return this.getSprite().getDirection();
  }

  public changeDirection(deltaX: number, deltaY: number) {
    return this.setDirection(getDirection(deltaX, deltaY));
  }

  public setDirection(direction: IDirection) {
    this.getSprite().setDirection(direction);
    return this;
  }

  public play(acc = 1) {
    this.getSprite().play(acc);
    return this;
  }

  public isPlaying() {
    return this.getSprite().isPlaying();
  }

  public stop() {
    this.getSprite().stop();
    return this;
  }

  public hide() {
    this.getSprite().hide();
    return this;
  }

  public show() {
    this.getSprite().show();
    return this;
  }

  public do(spriteName: string) {
    if (this.doing) {
      return;
    }
    const lastSprite = this.getSprite();
    const spriteDo = this.spriteMap[spriteName];
    if (!spriteDo) {
      throw new Error(`Fail to do "${spriteName}". no the sprite.`);
    }
    lastSprite.replace(spriteDo);
    this.current = spriteDo;

    if (spriteDo.isAnimation()) {
      if (!spriteDo.isLoopAnimation()) {
        this.doing = true;
        spriteDo.addEventListener(
          'onComplete',
          () => {
            spriteDo.replace(lastSprite);
            this.current = lastSprite;
            this.doing = false;
          },
          { once: true },
        );
      }
      spriteDo.play(undefined, 0);
    }
  }

  public isDoing() {
    return this.doing;
  }
}
