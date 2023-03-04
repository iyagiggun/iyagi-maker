import { Sprite } from 'pixi.js';
declare type Coords = [x: number, y: number, w: number, h: number];
declare type SpriteInfo = {
    coordsList: Coords[];
    xDiff?: number;
    yDiff?: number;
};
declare type Direction = 'up' | 'down' | 'left' | 'right';
export declare type IObjectInfo = {
    imageUrl: string;
    up?: SpriteInfo;
    down: SpriteInfo;
    left?: SpriteInfo;
    right?: SpriteInfo;
    visible?: boolean;
    passable?: boolean;
};
export default class IObject {
    private name;
    private objInfo;
    private sprite;
    private upS;
    private downS;
    private leftS;
    private rightS;
    private passable;
    private xDiff;
    private yDiff;
    private reaction?;
    constructor(name: string, objInfo: IObjectInfo);
    getName(): string;
    setReact(reaction: () => Promise<void>): void;
    react(): void;
    isPassable(): boolean;
    private getTexture;
    private getDirFrames;
    load(): Promise<void>;
    getSprite(): Sprite;
    getWidth(): number;
    getHeight(): number;
    getPos(): number[];
    setPos(x: number, y: number): void;
    getDirection(): Direction;
    changeDirectionWithDelta(deltaX: number, deltaY: number): void;
    changeDirection(direction: Direction): void;
    play(_speed: number): void;
    stop(): void;
}
export {};
