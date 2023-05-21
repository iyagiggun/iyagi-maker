import IObject from '../Object';
import SceneBase from './SceneBase';
export declare type EventType = 'start';
declare class SceneObjectManager extends SceneBase {
    protected objectList: IObject[];
    protected blockingObjectList: IObject[];
    constructor(name: string, objectList: IObject[]);
    load(): Promise<void[]>;
    addObject(obj: IObject): void;
    removeObject(obj: IObject): void;
    protected getObjectNextX(target: IObject, dist: number): number;
    protected getObjectNextY(target: IObject, dist: number): number;
}
export default SceneObjectManager;
