import { Sprite, Texture } from 'pixi.js';
import { IObject, ISpriteMap } from '.';
export declare type PhotoMap = {
    default: string;
    [key: string]: string;
};
export declare type ICharacter = IObject & {
    _photo: Sprite;
    _photoMap: PhotoMap;
    _photoTextureMap: {
        [key: string]: Texture;
    };
    _doing: boolean;
    load(): Promise<void>;
    getPhoto(): Sprite;
    isDoing(): boolean;
    do(actionISpriteKey: string): ICharacter;
};
export declare const ICharacterPrototype: any;
export declare const ICharacterMaker: {
    from(name: string, iSpriteMap: ISpriteMap, photoMap?: PhotoMap): ICharacter;
};
