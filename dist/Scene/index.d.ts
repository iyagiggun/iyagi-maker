import { Application } from 'pixi.js';
import ITile from '../Object/Tile';
import IObject from '../Object';
declare type SceneInfo = {
    margin: number;
};
export declare type ISceneEventType = 'start';
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
    dispatchEvent(event: CustomEvent): boolean;
    private getApplication;
    setApplication(app: Application): void;
    load(): Promise<void[]>;
    drawMap(): void;
    private getCameraPos;
    control(player: IObject): void;
    private getObjectNextX;
    private getObjectNextY;
    private getInteraction;
    talk(speaker: IObject, message: string): Promise<void>;
    moveCamera(target: IObject, speed?: number): Promise<void>;
    wait(seconds: number): Promise<void>;
}
export {};
