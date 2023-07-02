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
export default class ISprite {
    private imgUrl;
    private areaInfoMap;
    private loop;
    private loaded;
    private collisionModMap;
    private spriteMap;
    constructor(imgUrl: string, areaInfoMap: AreaInfoMap, loop?: boolean);
    load(): Promise<void>;
    getSprite(dir: Direction): Sprite;
    getCollisionMod(dir: Direction): Coords;
}
export {};
