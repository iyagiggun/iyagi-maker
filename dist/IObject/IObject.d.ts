import { Container } from 'pixi.js';
import { Area, IObjectInterface, Pos } from '.';
export declare type IObjectProps = {
    name: string;
    spriteUrl: string;
    spriteAreaList: Area[];
    collisionMod?: Area;
    loop?: boolean;
    pos?: Pos;
    zIndex?: number;
};
export default class IObject extends Container implements IObjectInterface {
    private props;
    private frameMap;
    private sprite?;
    reaction?: () => Promise<void>;
    constructor(props: IObjectProps);
    load(): Promise<void>;
    isLoaded(): boolean;
    private getSprite;
    getCollisionMod(): Area;
    getCollisionArea(): Area;
    getWidth(): number;
    getHeight(): number;
    getZIndex(): number;
    setZIndex(_zIndex?: number): this;
    getPos(): Pos;
    setPos([x, y]: Pos): this;
    isAnimation(): boolean;
    play(acc?: number): this;
    stop(): this;
}
