import Obj from '../Obj';
import { Coords } from '../Utils/Coordinate';
import SceneBase from './SceneBase';
export declare type EventType = 'start';
declare class SceneObjectManager extends SceneBase {
    protected objectList: Obj[];
    load(): Promise<void[]>;
    draw(): void;
    addObject(obj: Obj): this;
    addObjectList(objList: Obj[]): this;
    removeObject(obj: Obj): void;
    protected getObjectNextX(target: Obj, dist: number): number;
    protected getObjectNextY(target: Obj, dist: number): number;
    getIntersectingObjectList(coords: Coords): Obj[];
}
export default SceneObjectManager;
