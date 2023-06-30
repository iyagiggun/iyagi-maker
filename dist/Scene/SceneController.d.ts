import SceneCamera from './SceneCamera';
import ICharacter from '../IObject/ICharacter';
declare type ControlMode = 'battle' | 'peace';
export default class SceneController extends SceneCamera {
    private controlMode;
    private player?;
    private controller?;
    control(player: ICharacter, mode: ControlMode): void;
    private getInteraction;
    talk(speaker: ICharacter, message: string): Promise<void>;
    moveCharacter(target: ICharacter, [destX, destY]: [number, number], speed: number, chaseCamera: boolean): Promise<void>;
}
export {};
