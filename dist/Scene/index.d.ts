import IObject from '../Object';
import SceneController from './SceneController';
export default class Scene extends SceneController {
    private status;
    drawMap(): void;
    moveCharacter(target: IObject, [destX, destY]: [number, number], speed: number, chaseCamera: boolean): Promise<void>;
}
