import Obj from '../Obj';
import SceneObjectManager from './SceneObjectManager';
export default class SceneCamera extends SceneObjectManager {
    protected getCameraPos(target: Obj): number[];
    moveCamera(target: Obj, speed?: number): Promise<void>;
}
