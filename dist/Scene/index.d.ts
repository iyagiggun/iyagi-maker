import { Application } from 'pixi.js';
import { IObject } from '..';
import ITile from '../Object/Tile';
import ISceneEvent, { ISceneEventType } from './Event';
declare type SceneInfo = {
    margin: number;
};
export default class IScene extends EventTarget {
    private name;
    private tiles;
    private objectList;
    private status;
    private container;
    private width;
    private height;
    private app?;
    private margin;
    private player?;
    private controller?;
    private blockingObjectList;
    constructor(name: string, tiles: ITile[][], objectList: IObject[], info?: SceneInfo);
    addEventListener(type: ISceneEventType, callback: () => void): void;
    dispatchEvent(event: ISceneEvent): boolean;
    private getApplication;
    setApplication(app: Application): void;
    load(): Promise<void[]>;
    drawMap(): void;
    focus(target: IObject): void;
    control(player: IObject): void;
    private releaseControl;
    private getObjectNextX;
    private getObjectNextY;
    private interact;
    talk(speaker: IObject, message: string): Promise<void>;
}
export {};
