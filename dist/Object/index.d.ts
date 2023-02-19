import { Sprite } from 'pixi.js';
export declare type SpriteInfo = {
    imageUrl: string;
    area: [x: number, y: number, w: number, h: number];
};
export default class IGObject {
    private name;
    private spriteInfo;
    private sprite;
    constructor(name: string, spriteInfo: SpriteInfo);
    private getTexture;
    load(): Promise<void>;
    getSprite(): Sprite;
    bye(): void;
}
