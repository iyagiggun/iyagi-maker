import {
  AnimatedSprite, BaseTexture, Container,
  Sprite, Spritesheet, Texture,
} from 'pixi.js';
import { Area, IObjectInterface, Pos } from '.';
import { FRAMES_PER_SECOND } from '../Constant';

export type IObjectProps = {
  name: string;
  spriteUrl: string;
  spriteAreaList: Area[];
  collisionMod?: Area;
  loop?: boolean;
  pos?: Pos;
  zIndex?: number;
};

/**
 * 높이를 나타내는 zIndex 는 y 값에 따라 보정이 필요하므로 해당 값만큼의 y값에 따른 보정이 가능하도록 함.
 * 따라서, 맵의 크기가 Z_INDEX_MOD 값보다 크면 문제가 될 수 있음
 */
const Z_INDEX_MOD = 10000;
const DEFAULT_ANIMATION_SPEED = 6 / FRAMES_PER_SECOND; // 10 fps

const TEXTURE_MAP: { [key: string] : BaseTexture } = {};
const getTexture = (spriteUrl: string) => {
  if (!TEXTURE_MAP[spriteUrl]) {
    TEXTURE_MAP[spriteUrl] = BaseTexture.from(spriteUrl);
  }
  return TEXTURE_MAP[spriteUrl];
};

const areaListToFrame = (prefix: string) => (areaList: Area[] | undefined) => {
  if (!areaList) {
    return {};
  }
  return areaList.reduce((frames, [x, y, w, h], idx) => ({
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
  throw new Error(`Fail to get sprite. invalid frameKeyList. ${JSON.stringify(frameKeyList)}`);
};

export default class IObject extends Container implements IObjectInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private frameMap: any;

  private sprite?: Sprite;

  public reaction?: () => Promise<void>;

  constructor(private props: IObjectProps) {
    super();

    this.name = props.name;
    this.frameMap = areaListToFrame(`${props.name}-frame`)(props.spriteAreaList);

    this.setZIndex(this.props.zIndex ?? 1);
  }

  public async load() {
    if (this.sprite) {
      return;
    }

    await new Spritesheet(getTexture(this.props.spriteUrl), {
      frames: this.frameMap,
      meta: {
        scale: '1',
      },
    }).parse();

    this.sprite = getSprite(Object.keys(this.frameMap), this.props.loop);
    this.addChild(this.sprite);
    if (this.props.pos) {
      this.setPos(this.props.pos);
    }
  }

  public isLoaded() {
    return !!this.sprite;
  }

  private getSprite() {
    if (!this.sprite) {
      throw new Error(`"${this.name}" is not loaded.`);
    }
    return this.sprite;
  }

  public getCollisionMod(): Area {
    this.getSprite();
    if (this.props.collisionMod) {
      return this.props.collisionMod;
    }
    return [this.x, this.y, this.width, this.height];
  }

  public getCollisionArea(): Area {
    this.getSprite();
    const [x, y] = this.getPos();
    const [, , colsW, colsH] = this.getCollisionMod();
    return [x, y, colsW, colsH];
  }

  public getWidth() {
    return this.getCollisionMod()[2];
  }

  public getHeight() {
    return this.getCollisionMod()[3];
  }

  public getZIndex() {
    return Math.floor(this.zIndex / Z_INDEX_MOD);
  }

  public setZIndex(_zIndex?: number) {
    const zIndex = _zIndex ?? Math.floor(this.zIndex / Z_INDEX_MOD);
    this.zIndex = zIndex * Z_INDEX_MOD + this.y;
    return this;
  }

  public getPos(): Pos {
    this.getSprite();
    const [modX, modY] = this.getCollisionMod();
    return [this.x + modX, this.y + modY];
  }

  public setPos([x, y]: Pos) {
    this.getSprite();
    const [modX, modY] = this.getCollisionMod();
    this.x = x - modX;
    this.y = y - modY;
    this.setZIndex();
    return this;
  }

  public isAnimation() {
    const sprite = this.getSprite();
    return sprite instanceof AnimatedSprite;
  }

  public play(acc = 1, playPosition?: number) {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      throw new Error(`Fail to play animation. "${this.name}" is not an animation.`);
    }
    if (sprite.playing) {
      return this;
    }

    if (!sprite.playing) {
      // sprite.onFrameChange = () => {
      //   this.dispatchEvent(new FederatedEvent('onFrameChange'));
      // };
      // sprite.onComplete = () => {
      //   this.dispatchEvent(new Event('onComplete'));
      // };
      // sprite.onLoop = () => {
      //   this.dispatchEvent(new Event('onLoop'));
      // };
      if (playPosition === undefined) {
        sprite.play();
      } else {
        sprite.gotoAndPlay(playPosition);
      }
    } sprite.animationSpeed = acc * DEFAULT_ANIMATION_SPEED;

    sprite.play();
    return this;
  }

  public stop() {
    const sprite = this.getSprite();
    if (!(sprite instanceof AnimatedSprite)) {
      throw new Error(`Fail to stop animation. "${this.name}" is not an animation.`);
    }
    if (!sprite.playing) {
      return this;
    }
    sprite.stop();
    return this;
  }
}
