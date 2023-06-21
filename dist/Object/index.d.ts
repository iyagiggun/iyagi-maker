import { Container, Sprite } from 'pixi.js';
import ObjectWithSprites, { SpriteMap } from './ObjectWithSprites';
export declare type IDirection = 'up' | 'down' | 'left' | 'right';
export declare type IObjectInfo = {
    photoInfo?: {
        default: string;
        [key: string]: string;
    };
    pos?: [x: number, y: number, z?: number];
    dir?: IDirection;
    visible?: boolean;
    passable?: boolean;
    sprites: SpriteMap;
};
export default class IObject extends ObjectWithSprites {
    private info;
    private photo;
    private photoTextureMap?;
    private loaded;
    private passable;
    private reaction?;
    constructor(name: string, info: IObjectInfo);
    isLoaded(): boolean;
    load(): Promise<void>;
    getPhoto(): Sprite;
    changePhoto(key: string): void;
    setReaction(reaction: () => Promise<void>): void;
    getReaction(): (() => Promise<void>) | undefined;
    react(): Promise<void>;
    isPassable(): boolean;
    getCenterPos(): [number, number];
    getCoordinateRelationship(target: IObject): {
        distance: number;
        xDiff: number;
        yDiff: number;
    };
    attachAt(container: Container): void;
    detach(): void;
}
