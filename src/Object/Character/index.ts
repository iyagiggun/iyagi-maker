import { AnimatedSprite } from 'pixi.js';
import IObject, { IObjectInfo } from '..';

type ICharacterInfo = IObjectInfo & {
  motions?: {
    [key: string]: ICharacter
  }
};

export default class ICharacter extends IObject {
  private motions: { [key: string]: ICharacter } = {};

  constructor(name: string, info: ICharacterInfo) {
    super(name, info);
    this.motions = info.motions || {};
  }

  public do(motionName: string) {
    const motion = this.motions[motionName];
    if (!motion) {
      throw new Error(`Fail to do '${motionName}'. ${this.getName()} has no the motion.`);
    }
    const lastSprite = this.getSprite();
    const motionSprite = motion.getSprite() as AnimatedSprite;
    const { parent } = lastSprite;
    if (parent) {
      if (lastSprite instanceof AnimatedSprite) {
        lastSprite.stop();
      }
      motionSprite.x = lastSprite.x;
      motionSprite.y = lastSprite.y;
      console.error(`motion ${motionName}`);
      console.error(motion.getSprite());
      parent.removeChild(lastSprite);

      motion.getSprite().visible = true;
      parent.addChild(motion.getSprite());
      motionSprite.play();
    }
  }

  public async load(): Promise<void> {
    const promiseList = [
      super.load(),
      ...Object.values(this.motions).map((motion) => motion.load()),
    ];
    await Promise.all(promiseList);
    return Promise.resolve();
  }

  public attack(target: IObject) {
    console.error(33);
    console.error(this.motions);
  }
}
