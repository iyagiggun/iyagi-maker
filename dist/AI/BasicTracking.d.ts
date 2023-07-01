import { IObject } from '../IObject';
import { ICharacter } from '../IObject/ICharacter';
import IScene from '../Scene';
export declare const getCoordinateRelationship: (self: IObject, target: IObject) => {
    distance: number;
    xDiff: number;
    yDiff: number;
};
declare const IBasicTracking: (scene: IScene, tracker: ICharacter, target: ICharacter, onArrived?: () => void, interval?: number) => void;
export default IBasicTracking;
