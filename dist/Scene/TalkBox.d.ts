import { Graphics } from 'pixi.js';
import ICharacter from '../IObject/ICharacter';
export declare const getTalkBox: (speaker: ICharacter, message: string, { width, height }: {
    width: number;
    height: number;
}) => {
    talkBox: Graphics;
    talkEndPromise: Promise<void>;
};
