import { Sprite } from 'pixi.js';
import IObject, { ISpriteMap } from '.';
export declare type PhotoMap = {
    default: string;
    [key: string]: string;
};
export default class ICharacter extends IObject {
    private photoMap?;
    private photo;
    private doing;
    private photoTextureMap;
    constructor(name: string, iSpriteMap: ISpriteMap, photoMap?: PhotoMap | undefined);
    load(): Promise<void>;
    getPhoto(): Sprite;
    /**
     * not loop animation
     * @param actionSpriteKey
     * @returns
     */
    do(actionSpriteKey: string, speed?: number): Promise<boolean>;
    isDoing(): boolean;
}
