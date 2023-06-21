import IScene from '../Scene';
declare class Iyagi {
    private app;
    private currentScene?;
    private width;
    private height;
    constructor(canvas: HTMLCanvasElement);
    play(scene: IScene): Promise<void>;
}
export default Iyagi;
