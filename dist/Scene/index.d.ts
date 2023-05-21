import { Application } from 'pixi.js';
import IObject from '../Object';
import SceneObjectManager from './SceneObjectManager';
declare type ControlMode = 'battle' | 'peace';
export default class Scene extends SceneObjectManager {
    private status;
    private controlMode;
    private player?;
    private controller?;
    private getApplication;
    setApplication(app: Application): void;
    drawMap(): void;
    private getCameraPos;
    control(player: IObject, mode: ControlMode): void;
    private getInteraction;
    talk(speaker: IObject, message: string): Promise<void>;
    moveCamera(target: IObject, speed?: number): Promise<void>;
    moveCharacter(target: IObject, [destX, destY]: [number, number], speed: number, chaseCamera: boolean): Promise<void>;
    wait(seconds: number): Promise<void>;
}
export {};
