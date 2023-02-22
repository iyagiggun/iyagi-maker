import { Container } from 'pixi.js';
import { IObject } from '..';
import ITile from '../Object/Tile';
export default class IScene extends Container {
    private tiles;
    private objectList;
    constructor(tiles: ITile[][], objectList: IObject[]);
    private load;
    drawMap(): void;
}
