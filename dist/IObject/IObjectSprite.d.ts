import { Sprite } from 'pixi.js';
import { Coords, Direction } from '.';
declare type AreaInfo = {
    coordsList: Coords[];
    collisionMod?: Coords;
};
declare type ISpriteInfo = {
    name: string;
    imgUrl: string;
    up?: AreaInfo;
    down: AreaInfo;
    left?: AreaInfo;
    right?: AreaInfo;
    loop?: boolean;
    dir?: Direction;
};
export declare type ISprite = {
    getName: () => string;
    load: () => Promise<void>;
    getSprite: (dir: Direction) => Sprite;
    getCollisionMod: (dir: Direction) => Coords;
};
declare const _default: {
    from(info: ISpriteInfo): ISprite;
};
export default _default;
