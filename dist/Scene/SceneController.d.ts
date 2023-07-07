import SceneCamera from './SceneCamera';
import Character from '../Obj/Character';
declare type ControlMode = 'battle' | 'peace';
export default class SceneController extends SceneCamera {
    private controlMode;
    private player?;
    private controller?;
    control(player: Character, mode: ControlMode): void;
    private getInteraction;
    talk(speaker: Character, message: string): Promise<void>;
    moveCharacter(target: Character, [destX, destY]: [number, number], speed: number, chaseCamera: boolean): Promise<void>;
}
export {};
