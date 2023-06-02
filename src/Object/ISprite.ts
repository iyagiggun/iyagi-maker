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

export type IDirection = 'up' | 'down' | 'left' | 'right';

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

const getSprite = (frameKeyList: string[], animationSpeed = 1, loop = true) => {
  if (frameKeyList.length === 1) {
    return Sprite.from(frameKeyList[0]);
  }
  if (frameKeyList.length > 1) {
    const aSprite = new AnimatedSprite(frameKeyList.map((key) => Texture.from(key)));
    aSprite.loop = loop;
    aSprite.animationSpeed = animationSpeed;
    return aSprite;
  }
  return undefined;
};

export default class ISprite {
  private sprite? : Sprite;

  private loaded = false;

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
      this.info.up?.animationSpeed,
      this.info.up?.loop,
    );

    this.directionalSpriteMap.down = getSprite(
      Object.keys(frames.down),
      this.info.down?.animationSpeed,
      this.info.down?.loop,
    );

    this.directionalSpriteMap.left = getSprite(
      Object.keys(frames.left),
      this.info.left?.animationSpeed,
      this.info.left?.loop,
    );

    this.directionalSpriteMap.right = getSprite(
      Object.keys(frames.right),
      this.info.right?.animationSpeed,
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

  public show() {
    this.getSprite().visible = true;
    return this;
  }

  public hide() {
    this.getSprite().visible = false;
    return this;
  }

  public getCollisionMod() {
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

  public attach(container: Container) {
    container.addChild(this.getSprite());
  }

  public detach(container: Container) {
    container.removeChild(this.getSprite());
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

    const last = this.sprite;
    const [lastX, lastY] = last ? this.getPos() : [0, 0];

    this.sprite = next;
    this.collisionMod = this.info[direction]?.collisionCoords;
    if (!last) {
      return this;
    }
    if (last instanceof AnimatedSprite) {
      last.stop();
    }
    this.setPos(lastX, lastY);
    const { parent } = last;
    if (parent) {
      parent.removeChild(last);
      parent.addChild(this.sprite);
    }

    return this;
  }

  public play(speed: number) {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      return;
    }
    if (!sprite.playing) {
      sprite.play();
    }
    sprite.animationSpeed = (speed * 6) / FRAMES_PER_SECOND;
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
}