import ICharacter from '../IObject/ICharacter';
import IScene from '../Scene';
declare const IBasicTracking: (scene: IScene, tracker: ICharacter, target: ICharacter, onArrived?: () => void, interval?: number) => void;
export default IBasicTracking;
