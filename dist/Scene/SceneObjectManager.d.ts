import { IObject } from '../IObject';
import { Coords } from '../Utils/Coordinate';
import SceneBase from './SceneBase';
export declare type EventType = 'start';
declare class SceneObjectManager extends SceneBase {
    protected objectList: IObject[];
    constructor(name: string, objectList: IObject[]);
    load(): Promise<void[]>;
    addObject(obj: IObject): void;
    removeObject(obj: IObject): void;
    protected getObjectNextX(target: IObject, dist: number): number;
    protected getObjectNextY(target: IObject, dist: number): number;
    getIntersectingObjectList(coords: Coords): IObject[];
}
export default SceneObjectManager;
