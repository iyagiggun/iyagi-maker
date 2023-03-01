import { Application, Container } from 'pixi.js';
import { IObject } from '..';
import ITile from '../Object/Tile';
import ISceneEvent, { ISceneEventType } from './Event';
export default class IScene extends EventTarget {
    private name;
    private tiles;
    private objectList;
    private container;
    private width;
    private height;
    private app?;
    private controller?;
    constructor(name: string, tiles: ITile[][], objectList: IObject[]);
    getContainer(): Container<import("pixi.js").DisplayObject>;
    addEventListener(type: ISceneEventType, callback: () => void): void;
    dispatchEvent(event: ISceneEvent): boolean;
    private getApplication;
    setApplication(app: Application): void;
    load(): Promise<void[]>;
    drawMap(): void;
    private getFocusPos;
    controll(target: IObject): void;
    private getObjectNextX;
    private getObjectNextY;
    private interact;
}
