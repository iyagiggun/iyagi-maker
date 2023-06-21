import { IObjectInterface } from '../IObject';
import SceneObjectManager from './SceneObjectManager';
export default class SceneCamera extends SceneObjectManager {
    protected getCameraPos(target: IObjectInterface): number[];
    moveCamera(target: IObjectInterface, speed?: number): Promise<void>;
}
