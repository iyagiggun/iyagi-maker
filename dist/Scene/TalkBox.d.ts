import { Graphics } from 'pixi.js';
import IObject from '../Object';
export declare const getTalkBox: (speaker: IObject, message: string, { width, height }: {
    width: number;
    height: number;
}) => {
    talkBox: Graphics;
    talkEndPromise: Promise<void>;
};
