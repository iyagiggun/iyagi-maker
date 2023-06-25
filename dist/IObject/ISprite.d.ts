import { Sprite } from 'pixi.js';
import { Coords } from '../Utils/Coordinate';
import { Direction } from './type';
declare type AreaInfo = {
    coordsList: Coords[];
    collisionMod?: Coords;
};
declare type ISpriteProps = {
    name: string;
    imgUrl: string;
    up?: AreaInfo;
    down: AreaInfo;
    left?: AreaInfo;
    right?: AreaInfo;
    loop?: boolean;
    dir?: Direction;
};
export default class ISprite {
    private props;
    private loaded;
    private up?;
    private down?;
    private left?;
    private right?;
    constructor(props: ISpriteProps);
    load(): Promise<void>;
    getSprite(dir: Direction): Sprite;
    getCollisionMod(dir: Direction): number[];
}
export {};
