import { Container, Sprite } from 'pixi.js';
import { IObjectInterface, Pos } from '.';
import { IObjectProps } from './IObject';
declare type Direction = 'up' | 'down' | 'left' | 'right';
export declare type ICharacterProps = {
    name: string;
    spriteUrl: string;
    iObjectMap: {
        up?: SubIObjectProps;
        down: SubIObjectProps;
        left?: SubIObjectProps;
        right?: SubIObjectProps;
        [key: string]: SubIObjectProps | undefined;
    };
    pos?: Pos;
    zIndex?: number;
    direction?: Direction;
    photoMap?: {
        default: string;
        [key: string]: string;
    };
};
declare type SubIObjectProps = Omit<IObjectProps, 'name' | 'spriteUrl'>;
export default class ICharacter<T = void> extends Container implements IObjectInterface {
    private props;
    private status;
    private loaded;
    private current;
    reaction?: () => Promise<void>;
    private iObjectMap;
    private photo?;
    private photoTextureMap?;
    constructor(props: ICharacterProps & {
        status: T;
    });
    load(): Promise<void>;
    isLoaded(): boolean;
    private loadCheck;
    getCollisionMod(): import(".").Area;
    getCollisionArea(): import(".").Area;
    getWidth(): number;
    getHeight(): number;
    getZIndex(): number;
    setZIndex(zIndex?: number): this;
    getPos(): Pos;
    setPos([x, y]: Pos): this;
    getDirection(): Direction;
    setDirection(dir: Direction): void;
    isAnimation(): boolean;
    play(acc?: number): this;
    stop(): this;
    getPhoto(): Sprite;
    isDoing(): boolean;
}
export {};
