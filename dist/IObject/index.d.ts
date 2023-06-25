import { Container } from 'pixi.js';
import { Direction, Pos } from './type';
import { Coords } from '../Utils/Coordinate';
declare type AreaInfo = {
    coordsList: Coords[];
    collisionMod?: Coords;
};
declare type SpriteInfo = {
    up?: AreaInfo;
    down: AreaInfo;
    left?: AreaInfo;
    right?: AreaInfo;
    loop?: boolean;
};
export declare type IObjectProps = {
    name: string;
    spriteImgUrl: string;
    spriteInfoMap: {
        default: SpriteInfo;
        [key: string]: SpriteInfo;
    };
    pos?: Pos;
    dir?: Direction;
    zIndex?: number;
};
/**
 * 높이를 나타내는 zIndex 는 y 값에 따라 보정이 필요하므로 해당 값만큼의 y값에 따른 보정이 가능하도록 함.
 * 따라서, 맵의 크기가 Z_INDEX_MOD 값보다 크면 문제가 될 수 있음
 */
export declare const Z_INDEX_MOD = 10000;
export default class IObject extends Container {
    private props;
    private curISpriteKey?;
    private iSpriteMap;
    private dir;
    reaction?: () => Promise<void>;
    constructor(props: IObjectProps);
    load(): Promise<void>;
    isLoaded(): boolean;
    private getISprite;
    private getSprite;
    getCollisionMod(): number[];
    getCollisionArea(): Coords;
    getWidth(): number;
    getHeight(): number;
    getZIndex(): number;
    setZIndex(_zIndex?: number): this;
    getPos(): Pos;
    setPos([x, y]: Pos): this;
    getDirection(): Direction;
    setDirection(nextDir: Direction): this;
    play(acc?: number, playPosition?: number): this;
    stop(): this;
    getCenterPos(): number[];
}
export {};
