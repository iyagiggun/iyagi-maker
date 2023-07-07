import { Container } from 'pixi.js';
import { Coords } from '../Utils/Coordinate';
import ISprite from './ISprite';
import { Direction } from './type';
export declare type IPos = [x: number, y: number];
export declare type ISpriteMap = {
    default: ISprite;
    [key: string]: ISprite;
};
export declare const DEFAULT_ANIMATION_SPEED: number;
export default class Obj extends EventTarget {
    protected name: string;
    protected iSpriteMap: ISpriteMap;
    protected container: Container;
    protected loaded: boolean;
    protected iSprite: ISprite;
    private dir;
    private zIndex;
    reaction?: () => Promise<void>;
    constructor(name: string, iSpriteMap: ISpriteMap);
    getName(): string;
    getContainer(): Container<import("pixi.js").DisplayObject>;
    load(): Promise<void>;
    isLoaded(): boolean;
    getSprite(): import("pixi.js").Sprite;
    getCollisionMod(): Coords;
    getCollisionArea(): Coords;
    getWidth(): number;
    getHeight(): number;
    getZIndex(): number;
    setZIndex(zIndex: number): this;
    getPos(): IPos;
    setPos([x, y]: IPos): this;
    getDirection(): Direction;
    setDirection(nextDir: Direction): this;
    /**
     * loop animation
     * @param speed
     * @returns
     */
    play(speed?: number): this;
    stop(): this;
    getCenterPos(): number[];
    change(spriteKey: string): void;
}
