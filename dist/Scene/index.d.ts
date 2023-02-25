import { Container } from 'pixi.js';
import { IObject } from '..';
import ITile from '../Object/Tile';
export default class IScene extends Container {
    private tiles;
    private objectList;
    private controllTarget?;
    private controller?;
    constructor(tiles: ITile[][], objectList: IObject[]);
    load(): Promise<void[]>;
    drawMap(): void;
    controll(target: IObject): void;
}
