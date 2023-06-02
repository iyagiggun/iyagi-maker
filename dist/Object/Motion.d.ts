import { Sprite } from 'pixi.js';
import { Coords } from '../Utils/Coordinate';
declare type SpriteInfo = {
    coordsList: Coords[];
    collisionCoords?: Coords;
    loop?: boolean;
    animationSpeed?: number;
};
declare type MotionInfo = {
    spriteUrl: string;
    up?: SpriteInfo;
    down: SpriteInfo;
    left?: SpriteInfo;
    right?: SpriteInfo;
    dir?: IDirection;
};
export declare type IDirection = 'up' | 'down' | 'left' | 'right';
export default class ISprite {
    private name;
    private info;
    private sprite?;
    private loaded;
    private directionalSpriteMap;
    constructor(name: string, info: MotionInfo);
    load(): Promise<void>;
    getSprite(): Sprite;
    setDirection(direction: IDirection): this;
    play(speed: number): void;
    isPlaying(): boolean;
    stop(): void;
}
export {};
