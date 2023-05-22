import IObject from '../Object';
import SceneCamera from './SceneCamera';
declare type ControlMode = 'battle' | 'peace';
export default class SceneController extends SceneCamera {
    private controlMode;
    private player?;
    private controller?;
    control(player: IObject, mode: ControlMode): void;
    private getInteraction;
    talk(speaker: IObject, message: string): Promise<void>;
}
export {};
