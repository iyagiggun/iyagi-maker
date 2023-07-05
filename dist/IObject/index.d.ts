import { Container } from 'pixi.js';
import { Coords } from '../Utils/Coordinate';
import ISprite from './ISprite';
import { Direction } from './type';
export declare type IPos = [x: number, y: number];
export declare type ISpriteMap = {
    default: ISprite;
    [key: string]: ISprite;
};
export default class IObject extends Container {
    protected iSpriteMap: ISpriteMap;
    protected loaded: boolean;
    protected iSprite: ISprite;
    private dir;
    private iZIndex;
    reaction?: () => Promise<void>;
    constructor(name: string, iSpriteMap: ISpriteMap);
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
     * @param acc
     * @returns
     */
    play(acc?: number): this;
    stop(): this;
    getCenterPos(): number[];
    change(spriteKey: string): void;
}
