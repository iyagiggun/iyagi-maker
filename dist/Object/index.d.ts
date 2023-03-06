import { Container } from 'pixi.js';
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
    attachAt(container: Container): void;
    setReact(reaction: () => Promise<void>): void;
    react(): void;
    isPassable(): boolean;
    private getTexture;
    private getDirFrames;
    load(): Promise<void>;
    private getSprite;
    getWidth(): number;
    getHeight(): number;
    getPos(): number[];
    getGlobalPos(): number[];
    setPos(x: number, y: number, zIndexGap?: number): void;
    getDirection(): Direction;
    changeDirection(deltaX: number, deltaY: number): this;
    setDirection(direction: Direction): this;
    play(_speed: number): void;
    stop(): void;
    wait(time?: number): Promise<void>;
}
export {};
