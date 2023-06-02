import { AnimatedSprite } from 'pixi.js';
import IObject, { IObjectInfo } from '..';

type ICharacterInfo = IObjectInfo & {
  // motions?: {
  //   [key: string]: ICharacter
  // }
};

export default class ICharacter extends IObject {
  private motions: { [key: string]: ICharacter } = {};

  constructor(name: string, info: ICharacterInfo) {
    super(name, info);
    // this.motions = info.motions || {};
  }

  public do(motionName: string) {
    // const motion = this.motions[motionName];
    // if (!motion) {
    //   throw new Error(`Fail to do '${motionName}'. ${this.getName()} has no the motion.`);
    // }
    // const lastSprite = this.getSprite();
    // const { parent } = lastSprite;
    // if (!parent) {
    //   throw new Error(`Fail to do '${motionName}'. ${this.getName()} has no parent.`);
    // }
    // motion.setDirection(this.getDirection());
    // const motionSprite = motion.getSprite() as AnimatedSprite;
    // if (lastSprite instanceof AnimatedSprite) {
    //   lastSprite.stop();
    // }
    // // 중심축을 맞춰서 해줘야 하나..? 구이찮..
    // motionSprite.x = lastSprite.x;
    // motionSprite.y = lastSprite.y;
    // parent.removeChild(lastSprite);

    // motion.getSprite().visible = true;
    // parent.addChild(motion.getSprite());
    // motionSprite.play();
  }

  public async load(): Promise<void> {
    await Promise.all([
      super.load(),
      ...Object.values(this.motions).map((motion) => motion.load()),
    ]);
    return Promise.resolve();
  }

  public attack(target: IObject) {
    console.error(33);
    console.error(this.motions);
  }
}
