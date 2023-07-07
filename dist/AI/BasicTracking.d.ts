import Obj from '../Obj';
import Character from '../Obj/Character';
import Scene from '../Scene';
export declare const getCoordinateRelationship: (self: Obj, target: Obj) => {
    distance: number;
    xDiff: number;
    yDiff: number;
};
declare const IBasicTracking: (scene: Scene, tracker: Character, target: Character, onArrived?: () => void, interval?: number) => void;
export default IBasicTracking;
