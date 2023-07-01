import { IObject } from '../IObject';
import SceneObjectManager from './SceneObjectManager';
export default class SceneCamera extends SceneObjectManager {
    protected getCameraPos(target: IObject): number[];
    moveCamera(target: IObject, speed?: number): Promise<void>;
}
