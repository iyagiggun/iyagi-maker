import { Application, Container } from 'pixi.js';
import { IObject } from '..';
import ITile from '../Object/Tile';
export default class IScene extends Container {
    private tiles;
    private objectList;
    private app?;
    private controller?;
    constructor(name: string, tiles: ITile[][], objectList: IObject[]);
    setApplication(app: Application): void;
    private getApplication;
    load(): Promise<void[]>;
    drawMap(): void;
    private interact;
    controll(target: IObject): void;
    private getObjectNextX;
    private getObjectNextY;
}
