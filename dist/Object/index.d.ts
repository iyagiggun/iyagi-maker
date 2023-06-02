import { Container, Sprite } from 'pixi.js';
import { Coords } from '../Utils/Coordinate';
import ISprite from './ISprite';
declare type SpriteInfo = {
    coordsList: Coords[];
    collisionCoords?: Coords;
    loop?: boolean;
    animationSpeed?: number;
};
export declare type IDirection = 'up' | 'down' | 'left' | 'right';
export declare type IObjectInfo = {
    photoInfo?: {
        default: string;
        [key: string]: string;
    };
    spriteUrl: string;
    up?: SpriteInfo;
    down: SpriteInfo;
    left?: SpriteInfo;
    right?: SpriteInfo;
    pos?: [x: number, y: number, z?: number];
    dir?: IDirection;
    visible?: boolean;
    passable?: boolean;
    sprites: {
        default: ISprite;
        [key: string]: ISprite;
    };
};
export default class IObject {
    private name;
    private info;
    private photo;
    private photoTextureMap?;
    private loaded;
    private isprite;
    private passable;
    private reaction?;
    constructor(name: string, info: IObjectInfo);
    isLoaded(): boolean;
    load(): Promise<void>;
    getName(): string;
    getPhoto(): Sprite;
    changePhoto(key: string): void;
    getISprite(): ISprite;
    getCollisionMod(): Coords;
    setReaction(reaction: () => Promise<void>): void;
    getReaction(): (() => Promise<void>) | undefined;
    react(): Promise<void>;
    isPassable(): boolean;
    getPos(): [number, number];
    setPos(x: number, y: number, zMod?: number): this;
    getWidth(): number;
    getHeight(): number;
    getGlobalPos(): number[];
    getCollisionCoords(): number[];
    getDirection(): IDirection;
    changeDirection(deltaX: number, deltaY: number): this;
    setDirection(direction: IDirection): this;
    play(_speed: number): this;
    isPlaying(): boolean;
    stop(): this;
    hide(): this;
    show(): this;
    getCenterPos(): [number, number];
    getCoordinateRelationship(target: IObject): {
        distance: number;
        xDiff: number;
        yDiff: number;
    };
    attach(container: Container): void;
    detach(container: Container): void;
}
export {};
