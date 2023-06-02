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
export declare type IDirection = 'up' | 'down' | 'left' | 'right';
export default class ISprite {
    private name;
    private info;
    private sprite?;
    private loaded;
    private directionalSpriteMap;
    private collisionMod?;
    constructor(name: string, info: ISpriteInfo);
    load(): Promise<void>;
    private getSprite;
    show(): this;
    hide(): this;
    getCollisionMod(): Coords;
    getCollisionCoords(): number[];
    getWidth(): number;
    getHeight(): number;
    getPos(): [number, number];
    setPos(x: number, y: number, zMod?: number): this;
    getGlobalPos(): number[];
    attach(container: Container): void;
    detach(container: Container): void;
    getDirection(): IDirection;
    setDirection(direction: IDirection): this;
    play(speed: number): void;
    stop(): void;
    isPlaying(): boolean;
}
export {};
