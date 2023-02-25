import { Sprite } from 'pixi.js';
declare type Coords = [x: number, y: number, w: number, h: number];
declare type Direction = 'up' | 'down' | 'left' | 'right';
export declare type SpriteInfo = {
    imageUrl: string;
    up?: Coords[];
    down: Coords[];
    left?: Coords[];
    right?: Coords[];
    visible?: boolean;
};
export default class IObject {
    private name;
    private spriteInfo;
    private upS;
    private downS;
    private leftS;
    private rightS;
    private sprite;
    constructor(name: string, spriteInfo: SpriteInfo);
    getName(): string;
    private getTexture;
    private getDirFrames;
    load(): Promise<void>;
    getSprite(): Sprite;
    changeDirection(direction: Direction): void;
}
export {};
