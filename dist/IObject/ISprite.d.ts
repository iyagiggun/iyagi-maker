import { Sprite } from 'pixi.js';
import { Coords } from '../Utils/Coordinate';
import { Direction } from './type';
declare type AreaInfo = {
    coordsList: Coords[];
    collisionMod?: Coords;
};
declare type AreaInfoMap = {
    up?: AreaInfo;
    down: AreaInfo;
    left?: AreaInfo;
    right?: AreaInfo;
};
export declare type ISprite = {
    _imgUrl: string;
    _loaded: boolean;
    _areaInfoMap: AreaInfoMap;
    _loop: boolean;
    _spriteMap: {
        [key: string]: Sprite | undefined;
    };
    _collisionModMap: {
        [key: string]: Coords;
    };
    init(): void;
    load(): Promise<void>;
    getSprite(dir: Direction): Sprite;
    getCollisionMod(dir: Direction): Coords;
};
export declare const ISpritePrototype: ISprite;
export declare const ISpriteMaker: {
    from(imgUrl: string, areaInfoMap: AreaInfoMap, loop?: boolean): any;
};
export {};
