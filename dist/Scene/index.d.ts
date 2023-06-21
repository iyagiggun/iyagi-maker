import { DisplayObject } from 'pixi.js';
import SceneController from './SceneController';
export default class IScene extends SceneController {
    private status;
    drawMap(): void;
    addChild(child: DisplayObject): void;
}
