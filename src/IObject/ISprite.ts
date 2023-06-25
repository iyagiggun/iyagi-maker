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

type ISpriteProps = {
  name: string;
  imgUrl: string;
  up?: AreaInfo;
  down: AreaInfo;
  left?: AreaInfo;
  right?: AreaInfo;
  loop?: boolean;
  dir?: Direction;
};

export default class ISprite {
  private loaded = false;

  private up?: Sprite;

  private down?: Sprite;

  private left?: Sprite;

  private right?: Sprite;

  constructor(private props: ISpriteProps) {

  }

  public async load() {
    if (this.loaded) {
      return;
    }
    const upFrames = coordsListToFrame(`${this.props.name}:up`, this.props.up?.coordsList);
    const downFrames = coordsListToFrame(`${this.props.name}:down`, this.props.down?.coordsList);
    const leftFrames = coordsListToFrame(`${this.props.name}:left`, this.props.left?.coordsList);
    const rightFrames = coordsListToFrame(`${this.props.name}:right`, this.props.right?.coordsList);

    await new Spritesheet(getTexture(this.props.imgUrl), {
      frames: {
        ...upFrames, ...downFrames, ...leftFrames, ...rightFrames,
      },
      meta: {
        scale: '1',
      },
    }).parse();

    this.up = getSprite(Object.keys(upFrames), this.props.loop);
    this.down = getSprite(Object.keys(downFrames), this.props.loop);
    this.left = getSprite(Object.keys(leftFrames), this.props.loop);
    this.right = getSprite(Object.keys(rightFrames), this.props.loop);

    this.loaded = true;
  }

  public getSprite(dir: Direction) {
    if (!this.loaded) {
      throw new Error(`[ISprite.getSprite] Not loaded. "${this.props.name}"`);
    }
    let sprite: Sprite | undefined;
    switch (dir) {
      case 'up':
        sprite = this.up;
        break;
      case 'down':
        sprite = this.down;
        break;
      case 'left':
        sprite = this.left;
        break;
      case 'right':
        sprite = this.right;
        break;
      default:
        throw new Error(`[ISprite.getSprite] Invalid dir. ${dir}. "${this.props.name}"`);
    }
    if (!sprite) {
      throw new Error(`[ISprite.getSprite] No sprite. ${dir}. "${this.props.name}"`);
    }
    return sprite;
  }

  public getCollisionMod(dir: Direction) {
    if (!this.loaded) {
      throw new Error(`[ISprite.getCollisionMod] Not loaded. "${this.props.name}"`);
    }
    let collisionMod: Coords | undefined;
    switch (dir) {
      case 'up':
        collisionMod = this.props.up?.collisionMod;
        break;
      case 'down':
        collisionMod = this.props.down.collisionMod;
        break;
      case 'left':
        collisionMod = this.props.left?.collisionMod;
        break;
      case 'right':
        collisionMod = this.props.right?.collisionMod;
        break;
      default:
        throw new Error(`[ISprite.getCollisionMod] Invalid dir. ${dir}. "${this.props.name}"`);
    }
    if (!collisionMod) {
      const sprite = this.getSprite(dir);
      return [0, 0, sprite.width, sprite.height];
    }
    return collisionMod;
  }
}
