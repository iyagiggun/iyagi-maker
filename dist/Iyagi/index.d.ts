import { Application } from 'pixi.js';
import IScene from '../Scene';
declare class Iyagi {
    private app;
    private currentScene?;
    constructor(app: Application);
    play(scene: IScene): Promise<void>;
}
export default Iyagi;
