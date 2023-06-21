import {
  AnimatedSprite, BaseTexture, Container, Sprite, Spritesheet, Texture,
} from 'pixi.js';
import { COORDS_H_IDX, COORDS_W_IDX, Coords } from '../Utils/Coordinate';
import { FRAMES_PER_SECOND } from '../Constant';

type SpriteInfo = {
  coordsList: Coords[];
  collisionCoords?: Coords;
  loop?: boolean;
  animationSpeed?: number;
};

type ISpriteInfo = {
  spriteUrl: string;
  up?: SpriteInfo;
  down: SpriteInfo;
  left?: SpriteInfo;
  right?: SpriteInfo;
  dir?: IDirection;
};

type ISpriteEventType = 'onFrameChange' | 'onComplete' | 'onLoop';

export type IDirection = 'up' | 'down' | 'left' | 'right';

const DEFAULT_ANIMATION_SPEED = 6 / FRAMES_PER_SECOND; // 10 fps

const TEXTURE_MAP: { [key: string] : BaseTexture } = {};

const getTexture = (spriteUrl: string) => {
  if (!TEXTURE_MAP[spriteUrl]) {
    TEXTURE_MAP[spriteUrl] = BaseTexture.from(spriteUrl);
  }
  return TEXTURE_MAP[spriteUrl];
};

const coordsListToFrame = (prefix: string) => (coordsList: Coords[] | undefined) => {
  if (!coordsList) {
    return {};
  }
  return coordsList.reduce((frames, [x, y, w, h], idx) => ({
    ...frames,
    [`${prefix}-${idx}`]: {
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

export const getDirection = (deltaX: number, deltaY: number) => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left';
  }
  return deltaY > 0 ? 'down' : 'up';
};

export default class ISprite extends EventTarget {
  private sprite? : Sprite;

  private loaded = false;

  private container: Container | null = null;

  private directionalSpriteMap: {
    [key in IDirection]: Sprite | undefined;
  } = {
      up: undefined,
      down: undefined,
      left: undefined,
      right: undefined,
    };

  private collisionMod?: Coords;

  constructor(private name: string, private info: ISpriteInfo) {
    super();
  }

  public async load() {
    if (this.loaded) {
      return;
    }
    const frames = {
      up: coordsListToFrame(`${this.name}-up`)(this.info.up?.coordsList),
      down: coordsListToFrame(`${this.name}-down`)(this.info.down.coordsList),
      left: coordsListToFrame(`${this.name}-left`)(this.info.left?.coordsList),
      right: coordsListToFrame(`${this.name}-right`)(this.info.right?.coordsList),
    };

    await new Spritesheet(getTexture(this.info.spriteUrl), {
      frames: Object.values(frames).reduce((acc, _frames) => {
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
      },
    }).parse();

    this.directionalSpriteMap.up = getSprite(
      Object.keys(frames.up),
      this.info.up?.loop,
    );

    this.directionalSpriteMap.down = getSprite(
      Object.keys(frames.down),
      this.info.down?.loop,
    );

    this.directionalSpriteMap.left = getSprite(
      Object.keys(frames.left),
      this.info.left?.loop,
    );

    this.directionalSpriteMap.right = getSprite(
      Object.keys(frames.right),
      this.info.right?.loop,
    );

    this.setDirection(this.info.dir || 'down');
  }

  private getSprite() {
    if (!this.sprite) {
      throw new Error(`Fail to get "${this.name}" sprite. no data.`);
    }
    return this.sprite;
  }

  public addEventListener(type: ISpriteEventType, callback: () => void, options?: { once: boolean }) {
    super.addEventListener(type, callback, options);
  }

  public show() {
    this.getSprite().visible = true;
    return this;
  }

  public hide() {
    this.getSprite().visible = false;
    return this;
  }

  private getCollisionMod() {
    if (!this.collisionMod) {
      const sprite = this.getSprite();
      return [0, 0, sprite.width, sprite.height];
    }
    return this.collisionMod;
  }

  public getCollisionCoords() {
    const [x, y] = this.getPos();
    const [, , colsW, colsH] = this.getCollisionMod();
    return [x, y, colsW, colsH];
  }

  public getWidth() {
    return this.getCollisionMod()[COORDS_W_IDX];
  }

  public getHeight() {
    return this.getCollisionMod()[COORDS_H_IDX];
  }

  public getPos(): [number, number] {
    const [modX, modY] = this.getCollisionMod();
    const { x: spriteX, y: spriteY } = this.getSprite();
    return [spriteX + modX, spriteY + modY];
  }

  public setPos(x: number, y: number, zMod = 0) {
    const sprite = this.getSprite();
    const [modX, modY] = this.getCollisionMod();
    sprite.x = x - modX;
    sprite.y = y - modY;
    sprite.zIndex = sprite.y + sprite.height + zMod;
    return this;
  }

  public getGlobalPos() {
    const [modX, modY] = this.getCollisionCoords();
    const { x: globalX, y: globalY } = this.getSprite().getGlobalPosition();
    return [globalX + modX, globalY + modY];
  }

  public attachAt(container: Container) {
    if (this.container) {
      this.detach();
    }
    this.container = container;
    this.container.addChild(this.getSprite());
  }

  public detach() {
    if (!this.container) {
      throw new Error(`Fail to detach "${this.name}" no the container.`);
    }
    this.container.removeChild(this.getSprite());
    this.container = null;
  }

  public getDirection() {
    const sprite = this.getSprite();
    const dirs = Object.keys(this.directionalSpriteMap) as IDirection[];
    const found = dirs.find((dir) => this.directionalSpriteMap[dir] === sprite);
    if (!found) {
      throw new Error(`Fail to get "${this.name}" direction.`);
    }
    return found;
  }

  public setDirection(direction: IDirection) {
    const next = this.directionalSpriteMap[direction];
    if (!next) {
      throw new Error(`Fail to change "${this.name}" direction(${direction}). no data.`);
    }

    const lastSprite = this.sprite;
    const [lastX, lastY] = lastSprite ? this.getPos() : [0, 0];

    this.sprite = next;
    this.collisionMod = this.info[direction]?.collisionCoords;

    if (!lastSprite) {
      return this;
    }

    if (lastSprite instanceof AnimatedSprite) {
      lastSprite.stop();
    }

    if (!this.container) {
      return this;
    }

    this.container.removeChild(lastSprite);
    this.setPos(lastX, lastY);
    this.container.addChild(this.sprite);

    return this;
  }

  public play(acc = 1, playPosition?: number) {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      return;
    }
    if (sprite.playing) {
      return;
    }
    const dir = this.getDirection();
    const base = this.info[dir]?.animationSpeed || DEFAULT_ANIMATION_SPEED;
    sprite.animationSpeed = acc * base;
    if (!sprite.playing) {
      sprite.onFrameChange = () => {
        this.dispatchEvent(new CustomEvent('onFrameChange'));
      };
      sprite.onComplete = () => {
        this.dispatchEvent(new CustomEvent('onComplete'));
      };
      sprite.onLoop = () => {
        this.dispatchEvent(new CustomEvent('onLoop'));
      };
      if (playPosition === undefined) {
        sprite.play();
      } else {
        sprite.gotoAndPlay(playPosition);
      }
    }
  }

  public stop() {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      return;
    }
    sprite.stop();
  }

  public isPlaying() {
    if (!(this.sprite instanceof AnimatedSprite)) {
      return false;
    }
    return this.sprite.playing;
  }

  public replace(next: ISprite) {
    const { container } = this;
    if (!container) {
      throw new Error(`Fail to replace "${this.name}". no the container.`);
    }
    const [x, y] = this.getPos();
    next.setDirection(this.getDirection());
    next.setPos(x, y);
    this.stop();
    this.detach();
    next.attachAt(container);
  }

  public getCurrentFrame() {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      throw new Error(`Fail to get current fame. "${this.name}" is not AnimatiedSprite.`);
    }
    return sprite.currentFrame;
  }

  public isLoopAnimation() {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      return false;
    }
    return sprite.loop;
  }

  public isAnimation() {
    return this.getSprite() instanceof AnimatedSprite;
  }
}
