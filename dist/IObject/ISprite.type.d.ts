import { Sprite } from 'pixi.js';
import { Coords } from '../Utils/Coordinate';
import { Direction } from './type';
export declare type AreaInfo = {
    coordsList: Coords[];
    collisionMod?: Coords;
};
export declare type ISpriteProps = {
    name: string;
    imgUrl: string;
    up?: AreaInfo;
    down: AreaInfo;
    left?: AreaInfo;
    right?: AreaInfo;
    loop?: boolean;
    dir?: Direction;
};
export interface ISprite {
    _loaded: boolean;
    _props: ISpriteProps;
    up?: Sprite;
    down?: Sprite;
    left?: Sprite;
    right?: Sprite;
    load: () => Promise<void>;
    getSprite: (dir: Direction) => Sprite;
    getCollisionMod: (dir: Direction) => Coords;
    from: (props: ISpriteProps) => ISprite;
}
