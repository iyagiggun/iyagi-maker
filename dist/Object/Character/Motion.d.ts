import { SpriteInfo } from '..';
declare type MotionInfo = {
    spriteUrl: string;
    up?: SpriteInfo;
    down: SpriteInfo;
    left?: SpriteInfo;
    right?: SpriteInfo;
};
export default class Motion {
    constructor(info: MotionInfo);
}
export {};
