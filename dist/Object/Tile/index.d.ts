import { SpriteInfo } from '..';
import { IObject } from '../..';
export declare const TILE_SIZE = 32;
export default class ITile extends IObject {
    constructor(name: string, spriteInfo: SpriteInfo);
}