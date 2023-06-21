import { Container } from 'pixi.js';
import { Coords } from '../Utils/Coordinate';
declare type SpriteInfo = {
    coordsList: Coords[];
    collisionCoords?: Coords;
    loop?: boolean;
    animationSpeed?: number;
};
declare type ISpriteInfo = {
    spriteUrl: string;
    up?: SpriteInfo;
    down: SpriteInfo;
    left?: SpriteInfo;
    right?: SpriteInfo;
    dir?: IDirection;
};
declare type ISpriteEventType = 'onFrameChange' | 'onComplete' | 'onLoop';
export declare type IDirection = 'up' | 'down' | 'left' | 'right';
export declare const getDirection: (deltaX: number, deltaY: number) => "up" | "down" | "left" | "right";
export default class ISprite extends EventTarget {
    private name;
    private info;
    private sprite?;
    private loaded;
    private container;
    private directionalSpriteMap;
    private collisionMod?;
    constructor(name: string, info: ISpriteInfo);
    load(): Promise<void>;
    private getSprite;
    addEventListener(type: ISpriteEventType, callback: () => void, options?: {
        once: boolean;
    }): void;
    show(): this;
    hide(): this;
    private getCollisionMod;
    getCollisionCoords(): number[];
    getWidth(): number;
    getHeight(): number;
    getPos(): [number, number];
    setPos(x: number, y: number, zMod?: number): this;
    getGlobalPos(): number[];
    attachAt(container: Container): void;
    detach(): void;
    getDirection(): IDirection;
    setDirection(direction: IDirection): this;
    play(acc?: number, playPosition?: number): void;
    stop(): void;
    isPlaying(): boolean;
    replace(next: ISprite): void;
    getCurrentFrame(): number;
    isLoopAnimation(): boolean;
    isAnimation(): boolean;
}
export {};
