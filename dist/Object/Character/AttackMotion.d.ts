import { Coords } from '../../Utils/Coordinate';
declare type MotionMap = {
    up: Coords[];
    down: Coords[];
    left: Coords[];
    right: Coords[];
};
export default class Attack {
    private spriteUrl;
    constructor(spriteUrl: string, motionMap: MotionMap);
}
export {};
