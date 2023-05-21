import IObject from '../Object';
import SceneEvent from './SceneEvent';
export declare type EventType = 'start';
declare class SceneContainer extends SceneEvent {
    protected objectList: IObject[];
    protected blockingObjectList: IObject[];
    constructor(objectList: IObject[]);
    load(): Promise<void[]>;
    addObject(obj: IObject): void;
}
export default SceneContainer;
