import { Graphics } from 'pixi.js';
import Character from '../Obj/Character';
export declare const getTalkBox: (speaker: Character, message: string, { width, height }: {
    width: number;
    height: number;
}) => {
    talkBox: Graphics;
    talkEndPromise: Promise<void>;
};
