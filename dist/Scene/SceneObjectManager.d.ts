import { IObjectInterface } from '../IObject';
import { Coords } from '../Utils/Coordinate';
import SceneBase from './SceneBase';
export declare type EventType = 'start';
declare class SceneObjectManager extends SceneBase {
    protected objectList: IObjectInterface[];
    constructor(name: string, objectList: IObjectInterface[]);
    load(): Promise<void[]>;
    addObject(obj: IObjectInterface): void;
    removeObject(obj: IObjectInterface): void;
    protected getObjectNextX(target: IObjectInterface, dist: number): number;
    protected getObjectNextY(target: IObjectInterface, dist: number): number;
    getIntersectingObjectList(coords: Coords): IObjectInterface[];
}
export default SceneObjectManager;
