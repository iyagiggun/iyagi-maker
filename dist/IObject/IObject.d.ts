import { Container } from 'pixi.js';
import { Direction, Pos } from '.';
import { ISprite } from './ISprite';
export declare type IObjectProps = {
    name: string;
    iSpriteMap: {
        default: ISprite;
        [key: string]: ISprite;
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
    private dir;
    reaction?: () => Promise<void>;
    constructor(props: IObjectProps);
    load(): Promise<void>;
    isLoaded(): boolean;
    private getISprite;
    private getSprite;
    getCollisionMod(): Coords;
    getCollisionArea(): any[];
    getWidth(): Coords;
    getHeight(): Coords;
    getZIndex(): number;
    setZIndex(_zIndex?: number): this;
    getPos(): Pos;
    setPos([x, y]: Pos): this;
    getDirection(): Direction;
    setDirection(nextDir: Direction): void;
    play(acc?: number, playPosition?: number): this;
    stop(): this;
    getCenterPos(): number[];
}
