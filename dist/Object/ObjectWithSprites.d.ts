import ISprite, { IDirection } from './ISprite';
import ObjectBase from './ObjectBase';
export declare type SpriteMap = {
    default: ISprite;
    [key: string]: ISprite;
};
export default class ObjectWithSprites extends ObjectBase {
    private current;
    private spriteMap;
    private doing;
    constructor(name: string, spriteMap: SpriteMap);
    load(): Promise<void>;
    protected getSprite(): ISprite;
    getWidth(): number;
    getHeight(): number;
    getCollisionCoords(): number[];
    getDirection(): IDirection;
    changeDirection(deltaX: number, deltaY: number): this;
    setDirection(direction: IDirection): this;
    getPos(): [number, number];
    setPos(x: number, y: number, zMod?: number): this;
    getGlobalPos(): number[];
    play(acc?: number): this;
    isPlaying(): boolean;
    stop(): this;
    hide(): this;
    show(): this;
    do(spriteName: string): Promise<void>;
    isDoing(): boolean;
}
