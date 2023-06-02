"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
class ICharacter extends __1.default {
    constructor(name, info) {
        super(name, info);
        this.motions = {};
        // this.motions = info.motions || {};
    }
    do(motionName) {
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
    async load() {
        await Promise.all([
            super.load(),
            ...Object.values(this.motions).map((motion) => motion.load()),
        ]);
        return Promise.resolve();
    }
    attack(target) {
        console.error(33);
        console.error(this.motions);
    }
}
exports.default = ICharacter;
