import { Sprite } from 'pixi.js';
import IObject, { IObjectProps } from '.';
export declare type ICharacterProps = IObjectProps & {
    photoMap?: {
        default: string;
        [key: string]: string;
    };
};
export default class ICharacter<T = void> extends IObject {
    private cProps;
    private loaded;
    private status;
    private photo?;
    private photoTextureMap?;
    constructor(cProps: ICharacterProps & {
        status: T;
    });
    load(): Promise<void>;
    getPhoto(): Sprite;
    isDoing(): boolean;
}
