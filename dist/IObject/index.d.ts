import { Container, Sprite } from 'pixi.js';
import { Coords } from '../Utils/Coordinate';
import ISprite from './ISprite';
import { Direction, Pos } from './type';
export declare type ISpriteMap = {
    default: ISprite;
    [key: string]: ISprite;
};
export declare type IObject = Container & {
    _loaded: boolean;
    _iSprite: ISprite;
    _iSpriteMap: ISpriteMap;
    _dir: Direction;
    _iZIndex: number;
    load(): Promise<void>;
    isLoaded(): boolean;
    getSprite(): Sprite;
    getCollisionMod(): Coords;
    getCollisionArea(): Coords;
    getWidth(): number;
    getHeight(): number;
    getZIndex(): number;
    setZIndex(zIndex: number): IObject;
    getPos(): Pos;
    setPos(pos: Pos): IObject;
    getDirection(): Direction;
    setDirection(dir: Direction): IObject;
    play(acc?: number, playPosition?: number): IObject;
    stop(): IObject;
    getCenterPos(): Pos;
    change(key: string): IObject;
    emit(key: string, data: any): IObject;
    reaction(): Promise<void>;
};
export declare const IObjectPrototype: IObject;
export declare const IObjectMaker: {
    from(name: string, iSpriteMap: ISpriteMap): IObject;
};
